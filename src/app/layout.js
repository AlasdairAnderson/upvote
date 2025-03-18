import { Geist, Geist_Mono, ZCOOL_QingKe_HuangYou } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const zcoolQuingKeHaugYou = ZCOOL_QingKe_HuangYou({
  variable: "--font-zcool-qingke-huangyou",
  subsets: ["latin"],
  weight: '400'
})

export const metadata = {
  title: "Upvote",
  description: "Frontend application using Reddit API",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="logo">
        <img src="/upvotelogo.svg" alt="upvote logo"/>
        <h1 className={`${zcoolQuingKeHaugYou.variable}`}>UPVOTE</h1>
        </header>
        <main>
          {children}
        </main>
        <footer>
          <img id="categories" src="/widgetsIcon.svg" alt="categories"/>
          <img id="search"src="/searchIcon.svg" alt="search"/>
          <img id="user" src="/Arnold.jpg" alt="user icon"/>
        </footer>
      </body>
    </html>
  );
}
