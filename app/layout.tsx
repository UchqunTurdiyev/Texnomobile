import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Mobil sozlamalar
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#000000",
};

// Ideal Metadata
export const metadata: Metadata = {
  title: {
    default: "Texnomobile — Mobil Telefonlar va Aksessuarlar",
    template: "%s | Texnomobile",
  },
  description: "Eng so'nggi rusumdagi mobil telefonlar va aksessuarlar. Texnomobile bilan sifatli va arzon gadjetlarga ega bo'ling.",
  keywords: ["telefonlar", "smartfonlar", "aksessuarlar", "Texnomobile"],
  openGraph: {
    title: "Texnomobile — Mobil olamidagi hamrohingiz",
    description: "Sifatli telefonlar va aksessuarlar markazi.",
    url: "https://texnomobile.uz",
    siteName: "Texnomobile",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    locale: "uz_UZ",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="uz"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
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
      <body className="min-h-full flex flex-col">
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