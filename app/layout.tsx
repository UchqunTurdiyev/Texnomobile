
import Script from "next/script";

import type { Metadata, Viewport } from "next";

// Mobil qurilmalarda sayt qanday ko'rinishini boshqarish (zoom va ranglar)
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1, // Foydalanuvchi tasodifan kattalashtirib yubormasligi uchun (ixtiyoriy)
  userScalable: false,
  themeColor: "#000000", // Saytingizning asosiy rangi (tepadagi status bar rangi)
};

export const metadata: Metadata = {
  title: {
    default: "Texnomobile — Mobil Telefonlar va Aksessuarlar",
    template: "%s | Texnomobile", // Boshqa sahifalarda "Mahsulotlar | Texnomobile" bo'lib chiqadi
  },
  description: "Eng so'nggi rusumdagi mobil telefonlar va aksessuarlar. Texnomobile bilan sifatli va arzon gadjetlarga ega bo'ling.",
  keywords: ["telefonlar", "smartfonlar", "aksessuarlar", "gadjetlar", "Texnomobile"],
  authors: [{ name: "Texnomobile" }],
  
  // Ijtimoiy tarmoqlarda (Telegram, Facebook) havola yuborilganda chiqadigan ma'lumotlar
  openGraph: {
    title: "Texnomobile — Mobil olamidagi hamrohingiz",
    description: "Sifatli telefonlar va aksessuarlar markazi.",
    url: "https://texnomobile.uz", // Saytingiz manzili
    siteName: "Texnomobile",
    images: [
      {
        url: "/og-image.jpg", // public papkasida turishi kerak (1200x630px ideal)
        width: 1200,
        height: 630,
        alt: "Texnomobile do'koni",
      },
    ],
    locale: "uz_UZ",
    type: "website",
  },

  // Twitter (X) uchun sozlamalar
  twitter: {
    card: "summary_large_image",
    title: "Texnomobile — Sifatli telefonlar",
    description: "Eng arzon va sifatli gadjetlar faqat bizda.",
    images: ["/og-image.jpg"],
  },

  // Mobil qurilmalar uchun piktogrammalar (icons)
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png", // iPhone'da "Home screen"ga qo'shganda chiqadigan rasm
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz">
      <head>
        {/* Meta Pixel Script */}
        <Script
          id="fb-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1698964694881451');
              fbq('track', 'PageView');
            `,
          }}
        />
      </head>
      <body>
        {/* NoScript qismi (JS o'chirilgan holat uchun) */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1698964694881451&ev=PageView&noscript=1"
            alt="facebook_pixel"
          />
        </noscript>
        
        {children}
      </body>
    </html>
  );
}