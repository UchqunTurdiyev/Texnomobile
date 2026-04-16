'use client';

import { useState, Suspense, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaInstagram, FaTelegramPlane, FaPhoneAlt } from 'react-icons/fa';


// API uchun ma'lumotlar strukturasi
type LeadPayload = {
  fullName: string;
  phone: string;
  location: string;
  age: number;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
};

// Yordamchi funksiyalar
function normalizePhone(v: string) {
  return v.replace(/\s+/g, ' ').trim();
}

function isValidPhone(v: string) {
  return /^\+?\d[\d\s()-]{7,}$/.test(v);
}

function LeadForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Holatlar (States)
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [location, setLocation] = useState('');
  const [age, setAge] = useState<string>('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  // Validatsiya
  const canSubmit = useMemo(() => {
    const a = Number(age);
    return (
      fullName.trim().length >= 3 &&
      isValidPhone(normalizePhone(phone)) &&
      location.trim().length >= 2 &&
      Number.isFinite(a) &&
      a >= 5 &&
      a <= 120
    );
  }, [fullName, phone, location, age]);

  // Formani yuborish
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!canSubmit) {
      setError("Iltimos, barcha maydonlarni to'g'ri to'ldiring.");
      return;
    }

    // Payload yig'ish (UTM ma'lumotlari bilan)
    const payload: LeadPayload = {
      fullName: fullName.trim(),
      phone: normalizePhone(phone),
      location: location.trim(),
      age: Number(age),
      utm_source: searchParams.get('utm_source') ?? 'direct',
      utm_medium: searchParams.get('utm_medium') ?? '',
      utm_campaign: searchParams.get('utm_campaign') ?? '',
      utm_content: searchParams.get('utm_content') ?? '',
      utm_term: searchParams.get('utm_term') ?? '',
    };

    setLoading(true);
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      // Backenddan kelgan response statusini tekshirish
      if (!res.ok || (data && data.ok === false)) {
        throw new Error(data.error || 'Yuborishda xatolik yuz berdi.');
      }

      if (typeof window !== 'undefined') {
        sessionStorage.setItem('tb_name', payload.fullName);
      }

      setSent(true);

      // Muvaffaqiyatli yozuvini ko'rsatib, 1 soniyadan keyin thanks sahifasiga o'tish
      setTimeout(() => {
        router.push('/thanks'); // Yoki ehtiyojga qarab '/thank-you'
      }, 1000);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Noma'lum xatolik yuz berdi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center p-4">
      {/* Logo Section */}
      <div className="w-24 h-24 rounded-full flex items-center justify-center mt-10 mb-6 shadow-xl shadow-yellow-500/10 overflow-hidden relative">
        <Image
          src="/texnomobile.png"
          alt="Boost Mobile Uz Logo"
          fill
          className="object-cover"
          priority
        />
      </div>

      <h1 className="text-2xl font-bold text-[#ffce00] mb-2 uppercase tracking-wider">
        Boost Mobile Uz
      </h1>
      <p className="text-gray-400 mb-8 text-center max-w-sm">
        Buyurtma uchun ariza qoldiring
      </p>

      {/* Form Section */}
      <div className="w-full max-w-md bg-[#1a1a1a] p-6 rounded-2xl border border-gray-800 shadow-xl">
        {sent ? (
          <div className="text-center py-10">
            <h2 className="text-[#ffce00] text-xl font-bold mb-2">Muvaffaqiyatli!</h2>
            <p>Ma&apos;lumotlaringiz qabul qilindi. Tez orada bog&apos;lanamiz.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-1 text-gray-400">Ism va familiya</label>
              <input
                required
                type="text"
                placeholder="Uchqun Turdiyev"
                className="w-full p-3 rounded-lg bg-[#252525] border border-gray-700 focus:border-[#ffce00] outline-none transition"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoComplete="name"
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-gray-400">Telefon raqam</label>
              <input
                required
                type="tel"
                placeholder="+998 90 123 45 67"
                className="w-full p-3 rounded-lg bg-[#252525] border border-gray-700 focus:border-[#ffce00] outline-none transition"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                inputMode="tel"
                autoComplete="tel"
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-gray-400">Manzil</label>
              <input
                required
                type="text"
                placeholder="Toshkent sh, Chilonzor..."
                className="w-full p-3 rounded-lg bg-[#252525] border border-gray-700 focus:border-[#ffce00] outline-none transition"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                autoComplete="address-level2"
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-gray-400">Yoshingiz</label>
              <input
                required
                type="number"
                placeholder="25"
                className="w-full p-3 rounded-lg bg-[#252525] border border-gray-700 focus:border-[#ffce00] outline-none transition"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                inputMode="numeric"
              />
            </div>

            {/* Xatolik xabari */}
            {error && (
              <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20 text-center">
                {error}
              </div>
            )}

            <button
              disabled={loading || !canSubmit}
              type="submit"
              className="w-full bg-[#ffce00] text-black font-bold py-4 rounded-xl mt-4 hover:bg-[#e6b800] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? 'YUBORILMOQDA...' : 'BUYURTMA BERISH'}
            </button>
          </form>
        )}
      </div>

      {/* Tezkor aloqa tugmalari */}
      <div className="flex gap-4 mt-4">
        <a
          href="tel:+998941448444"
          className="flex items-center gap-2 bg-zinc-900 px-4 py-2 rounded-full border border-zinc-800 hover:border-[#ffce00] transition"
        >
          <FaPhoneAlt className="text-[#ffce00] text-sm" />
          <span className="text-xs font-bold">+998 (94) 144-84-44</span>
        </a>
      </div>

      <div className="flex gap-3 mt-3">
        <a
          href="https://instagram.com/boostmobileuz"
          target="_blank"
          rel="noreferrer"
          className="p-3 bg-zinc-900 rounded-full border border-zinc-800 text-pink-500 hover:scale-110 transition"
        >
          <FaInstagram size={20} />
        </a>
        <a
          href="https://t.me/boostmobileuz_admin"
          target="_blank"
          rel="noreferrer"
          className="p-3 bg-zinc-900 rounded-full border border-zinc-800 text-blue-400 hover:scale-110 transition"
        >
          <FaTelegramPlane size={20} />
        </a>
      </div>

      <footer className="mt-10 text-gray-500 text-xs">
        © 2026 Boost Mobile Uz. Barcha huquqlar himoyalangan.
      </footer>
    </main>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">Yuklanmoqda...</div>}>
      <LeadForm />
    </Suspense>
  );
}