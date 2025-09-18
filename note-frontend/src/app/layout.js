import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/common/navbar";

import ReduxProvider from "@/provider/reduxProvider";
import Footer from "@/components/common/footer";
import AutoLogout from "@/utils/autoLogout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Note Application",
  description: "The Note Application is a modern web-based platform that allows users to create, organize, and manage their notes efficiently",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      > 
      <ReduxProvider>
        <Navbar/>
        {children}
        <Footer/>
        <AutoLogout/>
      </ReduxProvider>
      
       
      </body>
    </html>
  );
}
