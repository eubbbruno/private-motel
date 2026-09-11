create table contacts (
  id uuid primary key default gen_random_uuid(),
  phone varchar(20) unique not null,
  name varchar(100),
  created_at timestamptz default now(),
  last_seen_at timestamptz default now(),
  notes text
);

create table conversations (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid references contacts(id),
  status varchar(20) default 'ai' check (status in ('ai', 'human', 'closed')),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unread_count int default 0
);

create table messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references conversations(id),
  direction varchar(10) check (direction in ('in', 'out')),
  content text not null,
  sent_by varchar(20) default 'ai' check (sent_by in ('ai', 'human', 'client')),
  created_at timestamptz default now(),
  evolution_message_id varchar(100)
);

create table ai_sessions (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references conversations(id) unique,
  is_ai_active boolean default true,
  taken_over_by varchar(100),
  taken_over_at timestamptz
);
