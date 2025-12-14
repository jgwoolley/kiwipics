import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Kiwipics",
  description: "Pictures of your favorite kiwi birds!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <h1>KiwiPics - A place to share pictures of Kiwis!</h1>
        <ul>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/upload">Image Upload</Link></li>
          <li><Link href="/login">Login</Link></li>
          <li><a href="https://github.com/jgwoolley/kiwipics" target="_blank" rel="noopener noreferrer">Source</a></li>
        </ul>
        {children}
        </body>
    </html>
  );
}
