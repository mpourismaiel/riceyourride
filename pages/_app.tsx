import type { AppProps } from "next/app";
import { Lexend } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Link from "next/link";

const font = Lexend({ subsets: ["latin"] });

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div
      className={cn(
        "min-h-screen bg-background antialiased dark",
        font.className
      )}
    >
      <div className="nav">
        <div className="container py-4">
          <Link href="/">
            <h1 className="text-3xl font-bold mb-2 text-foreground">
              Rice Your Ride!
            </h1>
          </Link>
          <p className="text-secondary-foreground">
            We pick what we think are the best rices for your inspiration!{" "}
            <span className="text-secondary-foreground/50">(WIP)</span>
          </p>
        </div>
      </div>
      <div className="body container mx-auto">
        <Component {...pageProps} />
        <div className="flex items-center justify-center pb-2 pt-8 text-foreground">
          <p>
            Made by{" "}
            <a href="https://mpourismaiel.com" className="px-1">
              Mahdi Pourismaiel
            </a>{" "}
            with ❤️ and
            <a href="https://nextjs.org" className="pl-1">
              Next.js
            </a>
            , coming to you from Cosmere!
          </p>
        </div>
        <div className="flex items-center justify-center pb-4 text-foreground">
          <p>
            Feel free to contribute to the project on{" "}
            <a href="https://github.com/mpourismaiel/riceyourride" className="px-1 font-bold">
              GitHub
            </a>. You can also submit your own rice by creating a pull request.
          </p>
        </div>
      </div>
    </div>
  );
}
