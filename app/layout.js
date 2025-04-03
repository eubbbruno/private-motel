import { Playfair_Display, Inter } from 'next/font/google';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-playfair',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-inter',
});

export const metadata = {
  title: 'Private Motel 5 Estrelas | Suítes Exclusivas em Londrina e Cambé',
  description: 'Descubra o Private Motel 5 Estrelas em Londrina e Cambé. Suítes exclusivas, reserva online, gastronomia e experiências únicas para momentos inesquecíveis.',
  keywords: 'motel 5 estrelas, suítes exclusivas, reserva online, Londrina, Cambé, experiências românticas, gastronomia, Private Motel',
  charset: 'UTF-8',
  robots: 'index, follow',
  openGraph: {
    title: 'Private Motel 5 Estrelas | Suítes Exclusivas em Londrina e Cambé',
    description: 'Descubra o Private Motel 5 Estrelas em Londrina e Cambé. Suítes exclusivas, reserva online, gastronomia e experiências únicas para momentos inesquecíveis.',
    url: 'https://www.privatemotel.com.br',
    type: 'website',
    images: [
      {
        url: 'https://www.privatemotel.com.br/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Private Motel 5 Estrelas',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Private Motel 5 Estrelas | Suítes Exclusivas em Londrina e Cambé',
    description: 'Descubra o Private Motel 5 Estrelas em Londrina e Cambé. Suítes exclusivas, reserva online, gastronomia e experiências únicas para momentos inesquecíveis.',
    image: 'https://www.privatemotel.com.br/images/og-image.jpg',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1.0,
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body
        className={`${playfair.variable} ${inter.variable} bg-dark-gray text-white`}
        style={{ margin: 0, padding: 0 }}
      >
        {children}
      </body>
    </html>
  );
}