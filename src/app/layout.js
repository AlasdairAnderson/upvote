import React from 'react';
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
        <StoreProvider children={children}>
          <header className="logo">
            <img src="/upvotelogo.svg" alt="upvote logo" />
            <h1>UPVOTE</h1>
          </header>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
