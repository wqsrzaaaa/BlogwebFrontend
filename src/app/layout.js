

import { Inter, Roboto_Mono, Ubuntu } from "next/font/google";
import "./globals.css";
import Provider from "./Provider";

const ubuntu = Ubuntu({ subsets: ["latin"], weight: ["400"] });

export const metadata = {
  title: "Bloggedin - Share Your Stories",
  description: "Bloggedin - Share Your Stories with the World",
  icons: {
    icon: "/bloglogo.png",
    shortcut: "/bloglogo.png",
  },
};

export default function RootLayout({ children }) {
  
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${ubuntu.className} antialiased`}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
