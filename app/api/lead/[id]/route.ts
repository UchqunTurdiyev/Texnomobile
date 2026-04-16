import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import TargetLeadModel from "@/models/TargetLeads";
import crypto from "crypto"; // Meta ma'lumotlarini hashlash uchun

// Meta-ga ma'lumot yuborish funksiyasi
async function sendMetaPurchase(lead: any) {
  const PIXEL_ID = process.env.FB_PIXEL_ID;
  const ACCESS_TOKEN = process.env.FB_ACCESS_TOKEN;

  if (!PIXEL_ID || !ACCESS_TOKEN) {
    console.error("Meta API sozlamalari topilmadi (.env faylni tekshiring)");
    return;
  }

  // Meta ma'lumotlarni SHA256 formatida hashlangan holda kutadi
  const hash = (val: string) => 
    val ? crypto.createHash("sha256").update(val.trim().toLowerCase()).digest("hex") : "";

  const userData = {
    // Telefon raqamidan faqat raqamlarni qoldirib hashlaymiz
    ph: lead.phone ? [hash(lead.phone.replace(/\D/g, ""))] : [],
    // Email bo'lsa hashlaymiz
    em: lead.email ? [hash(lead.email)] : [],
  };

  try {
    const response = await fetch(`https://graph.facebook.com/v18.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: [{
          event_name: "Purchase",
          event_time: Math.floor(Date.now() / 1000),
          action_source: "system_generated",
          user_data: userData,
          custom_data: {
            currency: "UZS",
            value: lead.price || 0, // Kurs narxi agar modelda bo'lsa
          }
        }]
      })
    });

    const result = await response.json();
    console.log("Meta API javobi:", result);
    return result;
  } catch (error) {
    console.error("Meta CAPI yuborishda xatolik:", error);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectToDB();
    const body = await req.json();

    const updateData: any = {};
    const pushData: any = {};

    if (body.status) updateData.status = body.status;
    if (body.reminderDate !== undefined) updateData.reminderDate = body.reminderDate;
    if (body.commentText) {
      updateData.lastComment = body.commentText;
      pushData.comments = { text: body.commentText, createdAt: new Date() };
    }

    const updatedLead = await TargetLeadModel.findByIdAndUpdate(
      id,
      { 
        $set: updateData,
        ...(body.commentText ? { $push: pushData } : {}) 
      },
      { new: true, runValidators: true }
    ).lean();

    if (!updatedLead) {
      return NextResponse.json({ error: "Lead topilmadi" }, { status: 404 });
    }

    // --- META PURCHASE INTEGRATSIYASI ---
    // Agar status "To'lov qilindi" ga o'zgargan bo'lsa Meta-ga yuboramiz
    // DIQQAT: 'To'lov qilindi' so'zi CRM'dagi ustun nomi bilan bir xil bo'lishi shart!
    if (body.status === "TO'LOV QILDI") {
       await sendMetaPurchase(updatedLead);
    }
    // ------------------------------------

    return NextResponse.json({ success: true, lead: updatedLead });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const { password } = body;

    const correctPassword = process.env.TARGET_DELETE_PASSWORD || "admin123";

    if (password !== correctPassword) {
      return NextResponse.json({ error: "Parol noto'g'ri!" }, { status: 403 });
    }

    await connectToDB();
    const deleted = await TargetLeadModel.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: "Lead topilmadi" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Lead muvaffaqiyatli o'chirildi" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}