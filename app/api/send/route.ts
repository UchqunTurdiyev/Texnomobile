import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();
  const { name, phone, address, age, utm } = body;

  const message = `
🚀 **Yangi Lid!**
👤 Ism: ${name}
📞 Tel: ${phone}
📍 Manzil: ${address}
🎂 Yoshi: ${age}

--- 📊 UTM Ma'lumotlari ---
🔗 Source: ${utm.source || 'Direct'}
📢 Medium: ${utm.medium || '-'}
📁 Campaign: ${utm.campaign || '-'}
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