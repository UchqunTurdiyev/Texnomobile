'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function ThanksPage() {
  const [seconds, setSeconds] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    // 10 soniyadan keyin Telegram-ga o'tish
    const timeout = setTimeout(() => {
      window.location.href = 'https://t.me/boostmobileuz_admin'; // Sizning admin link
    }, 10000);

    return () => {
      clearInterval(timer);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
     {/* Logo Section */}
      <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mt-10 mb-6 shadow-xl shadow-yellow-500/10 overflow-hidden relative">
        {/* // eslint-disable-next-line react/jsx-no-undef */}
        <Image 
          src="/texnomobile.jpg" // public/logo.jpg fayliga ishora
          alt="Boost Mobile Uz Logo"
          fill
          className="object-cover" // Rasmni doira ichiga chiroyli moslash
          priority // Rasmni tezroq yuklash uchun
        />
      </div>
      
      <h1 className="text-3xl font-bold text-[#ffce00] mb-4">RAHMAT!</h1>
      <p className="text-xl mb-2">Ma&apos;lumotlaringiz qabul qilindi.</p>
      <p className="text-gray-400 max-w-sm mb-8">
        Siz bilan tez orada bog&apos;lanamiz. {seconds} soniyadan keyin operatorimiz bilan bog&apos;lanish uchun Telegram-ga o&apos;tasiz...
      </p>

      <div className="w-full max-w-50 bg-zinc-800 h-1 rounded-full overflow-hidden">
        <div 
          className="bg-[#ffce00] h-full transition-all duration-1000 ease-linear"
          style={{ width: `${(seconds / 10) * 100}%` }}
        ></div>
      </div>

      <a 
        href="https://t.me/boostmobileuz_admin" 
        className="mt-10 text-[#ffce00] border border-[#ffce00] px-6 py-2 rounded-full hover:bg-[#ffce00] hover:text-black transition"
      >
        Kutmasdan o&apos;tish
      </a>
    </div>
  );
}
