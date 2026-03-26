import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();
  const { name, phone, address, age, utm } = body;

  const now = new Date();
  const date = now.toLocaleDateString('uz-UZ');
  const time = now.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });

  const message = `
🚀 **Yangi Lid!**
👤 Ism: ${name}
📞 Tel: ${phone}
📍 Manzil: ${address}
🎂 Yoshi: ${age}

📅 **Sana:** ${date}
⏰ **Vaqt:** ${time}

--- 📊 UTM Ma'lumotlari ---
🔗 Source: ${utm.source || 'Direct'}
📢 Medium: ${utm.medium || '-'}
📝 Content: ${utm.content || '-'}
🔍 Term: ${utm.term || '-'}
  `;

  const url = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;

  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown',
      }),
    });
    return NextResponse.json({ success: true });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}