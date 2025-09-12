"use client";

import { useState } from "react";
import { RestaurantCard } from "@/components/dashboard/restaurant-card";
import { Input } from "@/components/ui/input";
import { restaurants, menus } from "@/lib/data";
import { MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MenuItemCard } from "@/components/dashboard/menu-item-card";
import type { MenuItem } from "@/context/cart-context";

export default function FoodDeliveryPage() {
  const [view, setView] = useState<"restaurants" | "items">("restaurants");

  const allMenuItems = Object.values(menus).flatMap((menu) => menu.items);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          {view === "restaurants" ? "Restaurants Near You" : "All Food Items"}
        </h1>
        <p className="text-muted-foreground">
          {view === "restaurants"
            ? "Choose from a wide variety of cuisines."
            : "Browse individual dishes from all restaurants."}
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" className="shrink-0">
            <MapPin className="h-5 w-5" />
            <span className="hidden md:inline ml-2">Anytown, USA</span>
          </Button>
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder={
                view === "restaurants"
                  ? "Search restaurants..."
                  : "Search food items..."
              }
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={view === "restaurants" ? "default" : "outline"}
            onClick={() => setView("restaurants")}
          >
            Restaurants
          </Button>
          <Button
            variant={view === "items" ? "default" : "outline"}
            onClick={() => setView("items")}
          >
            Food Items
          </Button>
        </div>
      </div>
      {view === "restaurants" ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {restaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {allMenuItems.map((item) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
