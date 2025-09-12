import { Header } from "@/components/shared/header";
import { CartProvider } from "@/context/cart-context";
import { FavoritesProvider } from "@/context/favorites-context";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FavoritesProvider>
      <CartProvider>
        <div className="flex min-h-screen w-full flex-col">
          <Header />
          <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            {children}
          </main>
        </div>
      </CartProvider>
    </FavoritesProvider>
  );
}
