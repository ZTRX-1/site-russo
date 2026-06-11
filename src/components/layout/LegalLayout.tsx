import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useEffect } from "react";

interface LegalLayoutProps {
  title: string;
  children: React.ReactNode;
}

export function LegalLayout({ title, children }: LegalLayoutProps) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:py-24">
        <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl mb-12">
          {title}
        </h1>
        <div className="prose prose-slate max-w-none dark:prose-invert">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
