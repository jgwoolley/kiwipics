import type { Metadata } from "next";
import Link from "next/link";
import './navigation.css';

const TITLE = 'Kiwipics';
const DESCRIPTION = 'Pictures of your favorite kiwi birds!';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  authors: [{
    name: 'James Woolley',
    url: 'https://github.com/jgwoolley/',
  }],
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: 'https://www.kiwipics.com/',
    siteName: TITLE,
    images: [{
      url: 'https://www.kiwipics.com/amplify.svg',
      type: 'image/svg+xml',
    }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en">
      <body>
        <h1>🥝 KiwiPics - A place to share pictures of Kiwis!</h1>
        <nav className="navbar">
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/upload">Image Upload</Link></li>
            <li><Link href="/login">Login</Link></li>
            <li><Link href="/about">About</Link></li>
          </ul>
        </nav>
        {children}
        </body>
    </html>
  );
}
