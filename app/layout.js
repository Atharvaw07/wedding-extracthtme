import './globals.css';

export const metadata = {
  title: 'Meenal & Avinash — Wedding Celebration',
  description: 'Join us as we begin our forever. 1st July 2026',
  robots: 'noindex,nofollow',
  openGraph: {
    title: 'Meenal & Avinash — 1st July 2026',
    description: 'Join us as we begin our forever. 1st July 2026',
    images: ['https://pub-1953a6673e864f3488c645252f75de98.r2.dev/may/Meenal%20%26%20Avinash%201st%20july/WhatsApp%20Image%202026-05-10%20at%2012.06.13%20AM%20(1).jpeg'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌸</text></svg>" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500;1,600&family=Italianno&family=Pinyon+Script&family=Tangerine:wght@700&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
