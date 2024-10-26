import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Link from 'next/link';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Vd-Next",
  description: "vd",
};


const menuButton = (name: string, href: string) => {
  return (
    <Link href={href}
      className="text-small-semi text-ui-fg-base  font-thin flex items-center gap-x-2 basis-0
       text-gray-700 hover:text-black">
      {name}
    </Link>
  );
};

const footer = () => {
  return (
    <footer className="bottom-0 left-0 w-full flex justify-between 
      items-center p-4  border-t border-gray-300 z-50">
      <div style={{ flex: 1 }} >
        {menuButton('Movies', '/movies')}
      </div>
      <div style={{ flex: 1 }} >
        {menuButton('History', '/history')}
      </div>
      <div style={{ flex: 1 }} >
        {menuButton('List', '/lists')}
      </div>
    </footer>
  );
}

const header = () => {
  return (
    <header className="fixed top-0 left-0 w-full flex justify-between 
    items-center p-4 bg-white  border-b border-gray-300 z-50">
      {/* bg-gray-100 */}
      <div style={{ flex: 1 }} >
        {menuButton('Menu', '/')}
      </div>
      <div className="text-center" style={{ flex: 3 }} >
        <h1 className="text-2xl font-bold uppercase text-gray-600">Vd Next</h1>
      </div>
      <div className='items-end' style={{ flex: 1 }} >
        <div className="flex gap-5 justify-end">
          {menuButton('History', '/history')}
          {menuButton('List', '/lists')}
        </div>
      </div>
    </header>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {header()}
        {/* <div style={{ marginTop: 80, marginLeft: 10, marginRight: 10, minHeight: 800 }} > */}
        {/* <div className="container mt-20 mx-10 min-h-screen"> */}
        <div style={{height: 60}}></div>
        <div className="min-h-screen justify-center">
          {children}
        </div>
        <div className="py-4 w-full flex items-center justify-center">
          {footer()}
        </div>
      </body>
    </html>
  );
}
