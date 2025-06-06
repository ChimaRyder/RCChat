import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {ClerkProvider} from "@clerk/nextjs";
import {Toast} from "next/dist/client/components/react-dev-overlay/ui/components/toast";
import {Toaster} from "@/components/ui/sonner";
import {ThemeProvider} from "next-themes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "RC Chat",
  description: "Meet new friends with a twist.",
};

export default function RootLayout({ children }) {
  return (
      <ClerkProvider>
        <html lang="en" suppressHydrationWarning>
        <head>
            <link rel="icon" href="/soda-bottle.svg" />
        </head>
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
          <ThemeProvider
              attribute={"class"}
              defaultTheme={"system"}
              enableSystem
              disableTransitionOnChange
          >
              {children}
              <Toaster/>
          </ThemeProvider>
          </body>
        </html>
      </ClerkProvider>
  );
}
