import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Mintorafi - Mint Invoices On-Chain Instantly',
  description: 'Create, verify, and mint invoices as NFTs on the blockchain. Secure, transparent, and immutable invoice management with IPFS support.',
  keywords: 'blockchain, NFT, invoices, on-chain, verification, minting, IPFS, smart contracts',
  authors: [{ name: 'Mintorafi Team' }],
  openGraph: {
    title: 'Mintorafi - Mint Invoices On-Chain Instantly',
    description: 'Create, verify, and mint invoices as NFTs on the blockchain. Secure, transparent, and immutable invoice management.',
    type: 'website',
    url: 'https://mintorafi.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mintorafi - Mint Invoices On-Chain Instantly',
    description: 'Create, verify, and mint invoices as NFTs on the blockchain.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}