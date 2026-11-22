import { Navbar } from "@/components/shared/navbar";
import { AuthFooter } from "@/components/auth";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        {children}
      </main>
      <AuthFooter />
    </div>
  );
}
