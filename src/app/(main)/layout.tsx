import { Suspense } from "react";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Suspense fallback={<header className="w-full pt-4 px-4 sm:px-6 lg:px-8 h-20" />}>
        <Navbar />
      </Suspense>
      <div className="flex-1 flex flex-col">{children}</div>
      <Footer />
    </>
  );
}
