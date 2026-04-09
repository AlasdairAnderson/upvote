import React from 'react';
import Image from 'next/image';
import "./globals.css";
import StoreProvider from "./StoreProvider";


export const metadata = {
  title: "Upvote",
  description: "Frontend application using Reddit API",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <header className="logo">
            <Image src="/upvotelogo.svg" alt="upvote logo" width={40} height={40} />
            <h1>UPVOTE</h1>
          </header>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
