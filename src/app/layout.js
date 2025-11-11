import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Ubuntu } from "next/font/google";
import { ThemeProvider } from "next-themes";


const ubuntu = Ubuntu({
  subsets: ["latin"],
  weight: ["400"], 
});
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
    <html lang="en">
      <body
        className={` ${ubuntu.className} antialiased`}
      >
       <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
