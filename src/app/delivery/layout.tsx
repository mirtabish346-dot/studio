import Link from "next/link";
import { Icons } from "@/components/icons";
import { UserNav } from "@/components/shared/user-nav";

export default function DeliveryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-card px-4 md:px-6 z-50">
        <Link
          href="/delivery"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <Icons.logo className="h-6 w-6 text-primary" />
          <span>OmniServe Delivery</span>
        </Link>
        <div className="flex w-full items-center justify-end gap-4 md:ml-auto">
          <UserNav />
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {children}
      </main>
    </div>
  );
}
