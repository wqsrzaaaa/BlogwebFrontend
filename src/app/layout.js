import { Inter, Roboto_Mono, Ubuntu } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";

const ubuntu = Ubuntu({ subsets: ["latin"], weight: ["400"] });
const inter = Inter({ subsets: ["latin"], variable: "--font-geist-sans" });
const robotoMono = Roboto_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

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
      <body className={`${ubuntu.className} antialiased`}>
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
