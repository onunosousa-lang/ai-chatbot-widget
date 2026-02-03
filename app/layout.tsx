import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ChatMate Dashboard',
  description: 'Manage your AI chatbots and clients',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
