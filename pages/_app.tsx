import type { AppProps } from "next/app";
import { Lexend } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

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
          <h1 className="text-3xl font-bold mb-2 text-foreground">
            Rice Your Ride!
          </h1>
          <p className="text-secondary-foreground">
            We pick what we think are the best rices for your inspiration!{" "}
            <span className="text-secondary-foreground/50">(WIP)</span>
          </p>
        </div>
      </div>
      <div className="body container mx-auto">
        <Component {...pageProps} />
      </div>
    </div>
  );
}