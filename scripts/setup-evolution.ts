(async () => {
  const response = await fetch(`${process.env.EVOLUTION_API_URL}/instance/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': process.env.EVOLUTION_API_KEY!
    },
    body: JSON.stringify({
      instanceName: 'private-motel',
      integration: 'WHATSAPP-BAILEYS'
    })
  })

  console.log(await response.json())
})()
