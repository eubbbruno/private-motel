import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { getSupabase } from '../../../../lib/supabase'
import { BELLA_SYSTEM_PROMPT } from '../../../../lib/bella-prompt'

// Payload shape sent by Evolution API on messages.upsert
interface EvolutionMessageKey {
  remoteJid: string
  fromMe: boolean
  id: string
}

interface EvolutionMessage {
  conversation?: string
  extendedTextMessage?: { text: string }
  imageMessage?: { caption?: string }
  audioMessage?: Record<string, unknown>
  documentMessage?: { title?: string }
}

interface EvolutionPayload {
  event: string
  instance?: string
  data?: {
    key?: EvolutionMessageKey
    message?: EvolutionMessage
    messageTimestamp?: number
    pushName?: string
    status?: string
  }
}

interface DbMessage {
  direction: 'in' | 'out'
  content: string
}



function extractPhone(remoteJid: string): string {
  // "5543999999999@s.whatsapp.net" → "5543999999999"
  return remoteJid.replace(/@.+$/, '')
}

function extractContent(message: EvolutionMessage): string | null {
  return (
    message.conversation ??
    message.extendedTextMessage?.text ??
    message.imageMessage?.caption ??
    (message.audioMessage ? '[Áudio]' : null) ??
    message.documentMessage?.title ??
    null
  )
}

function buildClaudeMessages(history: DbMessage[]): Anthropic.MessageParam[] {
  const messages: Anthropic.MessageParam[] = []

  for (const msg of history) {
    const role = msg.direction === 'in' ? 'user' : 'assistant'

    // Merge consecutive same-role messages
    const last = messages[messages.length - 1]
    if (last && last.role === role) {
      last.content += '\n' + msg.content
    } else {
      messages.push({ role, content: msg.content })
    }
  }

  // Claude requires the first message to be from the user
  while (messages.length > 0 && messages[0].role !== 'user') {
    messages.shift()
  }

  return messages
}

async function sendEvolutionMessage(phone: string, text: string): Promise<void> {
  const url = `${process.env.EVOLUTION_API_URL}/message/sendText/${process.env.EVOLUTION_INSTANCE}`
  await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: process.env.EVOLUTION_API_KEY!,
    },
    body: JSON.stringify({ number: phone, text }),
  })
}

async function generateAndSendBellaReply(
  conversationId: string,
  phone: string
): Promise<void> {
  const supabase = getSupabase()
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  // Check if AI is active for this conversation
  const { data: session } = await supabase
    .from('ai_sessions')
    .select('is_ai_active')
    .eq('conversation_id', conversationId)
    .single()

  if (!session?.is_ai_active) return

  // Fetch recent message history for context (last 30 messages)
  const { data: history } = await supabase
    .from('messages')
    .select('direction, content')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })
    .limit(30)

  const claudeMessages = buildClaudeMessages((history ?? []) as DbMessage[])
  if (claudeMessages.length === 0) return

  // Call Claude with cached system prompt
  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    system: [
      {
        type: 'text',
        text: BELLA_SYSTEM_PROMPT,
        cache_control: { type: 'ephemeral' },
      },
    ],
    messages: claudeMessages,
  })

  const replyText =
    response.content[0]?.type === 'text' ? response.content[0].text : null

  if (!replyText) return

  // Send reply via Evolution API and persist it
  await Promise.all([
    sendEvolutionMessage(phone, replyText),
    supabase.from('messages').insert({
      conversation_id: conversationId,
      direction: 'out',
      content: replyText,
      sent_by: 'ai',
    }),
  ])
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY ||
      !process.env.ANTHROPIC_API_KEY || !process.env.EVOLUTION_API_URL ||
      !process.env.EVOLUTION_API_KEY || !process.env.EVOLUTION_INSTANCE) {
    return NextResponse.json({ error: 'Integração não configurada' }, { status: 503 })
  }
  const supabase = getSupabase()
  let payload: EvolutionPayload

  try {
    payload = await request.json()
  } catch {
    // Malformed body — still return 200 so Evolution does not retry
    return NextResponse.json({ ok: true })
  }

  // Only process incoming/outgoing messages
  if (payload.event !== 'messages.upsert' || !payload.data?.key) {
    return NextResponse.json({ ok: true })
  }

  const { key, message, pushName } = payload.data

  // Ignore group messages (jid ends with @g.us)
  if (!key || key.remoteJid.endsWith('@g.us')) {
    return NextResponse.json({ ok: true })
  }

  const content = message ? extractContent(message) : null
  if (!content) {
    return NextResponse.json({ ok: true })
  }

  const phone = extractPhone(key.remoteJid)
  const direction = key.fromMe ? 'out' : 'in'
  const sentBy = key.fromMe ? 'human' : 'client'

  try {
    // ── 1. Upsert contact ────────────────────────────────────────────────────
    const { data: contact, error: contactError } = await supabase
      .from('contacts')
      .upsert(
        {
          phone,
          name: pushName ?? null,
          last_seen_at: new Date().toISOString(),
        },
        { onConflict: 'phone', ignoreDuplicates: false }
      )
      .select('id')
      .single()

    if (contactError || !contact) {
      console.error('[webhook] contact upsert error:', contactError)
      return NextResponse.json({ ok: true })
    }

    // ── 2. Find or create open conversation ──────────────────────────────────
    let conversationId: string

    const { data: existing } = await supabase
      .from('conversations')
      .select('id, unread_count')
      .eq('contact_id', contact.id)
      .neq('status', 'closed')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (existing) {
      conversationId = existing.id

      if (direction === 'in') {
        await supabase
          .from('conversations')
          .update({
            unread_count: (existing.unread_count ?? 0) + 1,
            updated_at: new Date().toISOString(),
          })
          .eq('id', conversationId)
      } else {
        await supabase
          .from('conversations')
          .update({ updated_at: new Date().toISOString() })
          .eq('id', conversationId)
      }
    } else {
      const { data: created, error: convError } = await supabase
        .from('conversations')
        .insert({
          contact_id: contact.id,
          status: 'ai',
          unread_count: direction === 'in' ? 1 : 0,
        })
        .select('id')
        .single()

      if (convError || !created) {
        console.error('[webhook] conversation insert error:', convError)
        return NextResponse.json({ ok: true })
      }

      conversationId = created.id

      await supabase
        .from('ai_sessions')
        .insert({ conversation_id: conversationId, is_ai_active: true })
    }

    // ── 3. Save message ──────────────────────────────────────────────────────
    const { error: msgError } = await supabase.from('messages').insert({
      conversation_id: conversationId,
      direction,
      content,
      sent_by: sentBy,
      evolution_message_id: key.id,
    })

    if (msgError) {
      console.error('[webhook] message insert error:', msgError)
    }

    // ── 4. Bella AI reply (inbound only) ─────────────────────────────────────
    if (direction === 'in') {
      generateAndSendBellaReply(conversationId, phone).catch(err =>
        console.error('[webhook] bella reply error:', err)
      )
    }
  } catch (err) {
    console.error('[webhook] unexpected error:', err)
  }

  // Always return 200 so Evolution API does not retry
  return NextResponse.json({ ok: true })
}
