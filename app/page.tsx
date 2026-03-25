'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

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
      <div className="w-32 h-32 bg-[#ffce00] rounded-full flex items-center justify-center mt-10 mb-6 shadow-lg shadow-[#ffce00]/20">
        <span className="text-black font-bold text-center leading-tight">
          BOOST<br/>MOBILE<br/><span className="text-[10px]">uz</span>
        </span>
      </div>

      <h1 className="text-2xl font-bold text-[#ffce00] mb-2 uppercase tracking-wider">
        Boost Mobile Uz
      </h1>
      <p className="text-gray-400 mb-8 text-center max-w-sm">
        Perfectum Mobile telefonlari uchun buyurtma qoldiring
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
              className="w-full bg-[#ffce00] text-black font-bold py-4 rounded-xl mt-4 hover:bg-[#e6b800] active:scale-95 transition-all"
            >
              {loading ? "Yuborilmoqda..." : "BUYURTMA BERISH"}
            </button>
          </form>
        )}
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