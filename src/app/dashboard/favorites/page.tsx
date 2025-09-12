"use client";

import { useFavorites } from "@/context/favorites-context";
import { RestaurantCard } from "@/components/dashboard/restaurant-card";
import { MenuItemCard } from "@/components/dashboard/menu-item-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useEffect, useState } from "react";

export default function FavoritesPage() {
  const { favoriteRestaurants, favoriteMenuItems, clearAllFavorites } =
    useFavorites();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const hasFavorites =
    favoriteRestaurants.length > 0 || favoriteMenuItems.length > 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            My Favorites
          </h1>
          <p className="text-muted-foreground">
            Your favorite restaurants and food items all in one place.
          </p>
        </div>
        {isClient && hasFavorites && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Clear All</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently remove all
                  your favorite restaurants and items.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={clearAllFavorites}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      <Tabs defaultValue="restaurants" className="w-full">
        <TabsList>
          <TabsTrigger value="restaurants">
            Restaurants ({isClient ? favoriteRestaurants.length : 0})
          </TabsTrigger>
          <TabsTrigger value="items">Food Items ({isClient ? favoriteMenuItems.length : 0})</TabsTrigger>
        </TabsList>
        <TabsContent value="restaurants">
          {isClient && favoriteRestaurants.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-4">
              {favoriteRestaurants.map((restaurant) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground mt-4">
              {isClient ? "You haven't favorited any restaurants yet." : "Loading..."}
            </p>
          )}
        </TabsContent>
        <TabsContent value="items">
          {isClient && favoriteMenuItems.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
              {favoriteMenuItems.map((item) => (
                <MenuItemCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground mt-4">
              {isClient ? "You haven't favorited any food items yet." : "Loading..."}
            </p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
