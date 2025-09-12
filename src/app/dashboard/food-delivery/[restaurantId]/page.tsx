import { restaurants, menus } from "@/lib/data";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Star } from "lucide-react";
import { MenuItemCard } from "@/components/dashboard/menu-item-card";
import type { MenuItem } from "@/context/cart-context";

type RestaurantMenu = {
  restaurantId: string;
  name: string;
  items: MenuItem[];
};

export default function MenuPage({
  params,
}: {
  params: { restaurantId: string };
}) {
  const restaurant = restaurants.find((r) => r.id === params.restaurantId);
  const menu: RestaurantMenu | undefined = (menus as Record<string, RestaurantMenu>)[
    params.restaurantId
  ];

  if (!restaurant || !menu) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <div className="relative h-64 w-full rounded-lg overflow-hidden mb-4">
          <Image
            src={restaurant.image}
            alt={restaurant.name}
            fill
            className="object-cover"
            data-ai-hint={restaurant.imageHint}
          />
        </div>
        <h1 className="text-4xl font-bold tracking-tight font-headline">
          {restaurant.name}
        </h1>
        <div className="flex items-center gap-4 text-muted-foreground mt-2">
          <span>{restaurant.cuisine}</span>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span>{restaurant.rating}</span>
          </div>
        </div>
        <p className="mt-2">{restaurant.description}</p>
      </div>

      <div>
        <h2 className="text-2xl font-bold tracking-tight font-headline mb-4">
          Menu
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {menu.items.map((item) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
