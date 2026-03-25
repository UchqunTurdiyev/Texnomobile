'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaInstagram, FaTelegramPlane, FaPhoneAlt } from 'react-icons/fa';


function LeadForm() {
  const searchParams = useSearchParams();
  const router = useRouter(); // Routerni e'lon qilamiz
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '+998',
    address: '',
    age: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const utm = {
      source: searchParams.get('utm_source'),
      medium: searchParams.get('utm_medium'),
      campaign: searchParams.get('utm_campaign'),
      content: searchParams.get('utm_content'),
      term: searchParams.get('utm_term'),
    };

    try {
      const res = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }, // Header qo'shish tavsiya etiladi
        body: JSON.stringify({ ...formData, utm }),
      });

      if (res.ok) {
        setSent(true);
        setFormData({ name: '', phone: '+998', address: '', age: '' });
        
        // Muvaffaqiyatli yuborilgach, 1 soniya kutib keyin Thanks sahifasiga o'tkazish
        // (foydalanuvchi "Muvaffaqiyatli" yozuvini ko'rib ulgurishi uchun)
        setTimeout(() => {
          router.push('/thanks');
        }, 1000);
      } else {
        alert("Xatolik yuz berdi. Qayta urinib ko'ring!");
      }
    } catch (error) {
      console.error("Xatolik:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center p-4">
      {/* Logo Section */}
    <div className="w-24 h-24 rounded-full flex items-center justify-center mt-10 mb-6 shadow-xl shadow-yellow-500/10 overflow-hidden relative">
        <Image 
          src="/texnomobile.png" // public/logo.jpg fayliga ishora
          alt="Boost Mobile Uz Logo"
          fill
          className="object-cover" // Rasmni doira ichiga chiroyli moslash
          priority // Rasmni tezroq yuklash uchun
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
            <button 
              onClick={() => setSent(false)}
              className="mt-6 text-sm text-[#ffce00] underline"
            >
              Yana yuborish
            </button>
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
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-gray-400">Telefon raqam</label>
              <input
                required
                type="tel"
                value={formData.phone}
                className="w-full p-3 rounded-lg bg-[#252525] border border-gray-700 focus:border-[#ffce00] outline-none transition"
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-gray-400">Manzil</label>
              <input
                required
                type="text"
                placeholder="Toshkent sh, Chilonzor..."
                className="w-full p-3 rounded-lg bg-[#252525] border border-gray-700 focus:border-[#ffce00] outline-none transition"
                onChange={(e) => setFormData({...formData, address: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-gray-400">Yoshingiz</label>
              <input
                required
                type="number"
                placeholder="25"
                className="w-full p-3 rounded-lg bg-[#252525] border border-gray-700 focus:border-[#ffce00] outline-none transition"
                onChange={(e) => setFormData({...formData, age: e.target.value})}
              />
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-[#ffce00] cursor-pointer text-black font-bold py-4 rounded-xl mt-4 hover:bg-[#e6b800] active:scale-95 transition-all"
            >
              {loading ? "Yuborilmoqda..." : "BUYURTMA BERISH"}
            </button>
          </form>
        )}
      </div>

        {/* Tezkor aloqa tugmalari */}
        <div className="flex gap-4 mt-4">
          <a href="tel:+998941448444" className="flex items-center gap-2 bg-zinc-900 px-4 py-2 rounded-full border border-zinc-800 hover:border-[#ffce00] transition">
            {/* // eslint-disable-next-line react/jsx-no-undef */}
            <FaPhoneAlt className="text-[#ffce00] text-sm" />
            <span className="text-xs font-bold">+998 (94) 144-84-44</span>
          </a>
        </div>

        <div className="flex gap-3 mt-3">
          <a href="https://instagram.com/boostmobileuz" target="_blank" className="p-3 bg-zinc-900 rounded-full border border-zinc-800 text-pink-500 hover:scale-110 transition">
            <FaInstagram size={20} />
          </a>
          <a href="https://t.me/boostmobileuz_admin" target="_blank" className="p-3 bg-zinc-900 rounded-full border border-zinc-800 text-blue-400 hover:scale-110 transition">
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
    <Suspense fallback={<div>Yuklanmoqda...</div>}>
      <LeadForm />
    </Suspense>
  );
}