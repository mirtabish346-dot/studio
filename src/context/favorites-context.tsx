"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import type { MenuItem } from "./cart-context";
import { useToast } from "@/hooks/use-toast";

interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  image: string;
  imageHint: string;
}

interface FavoritesContextType {
  favoriteRestaurants: Restaurant[];
  favoriteMenuItems: MenuItem[];
  addRestaurantToFavorites: (restaurant: Restaurant) => void;
  removeRestaurantFromFavorites: (restaurantId: string) => void;
  isRestaurantFavorite: (restaurantId: string) => boolean;
  addMenuItemToFavorites: (item: MenuItem) => void;
  removeMenuItemFromFavorites: (itemId: string) => void;
  isMenuItemFavorite: (itemId: string) => boolean;
  clearAllFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  
  const [favoriteRestaurants, setFavoriteRestaurants] = useState<Restaurant[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = window.localStorage.getItem("favoriteRestaurants");
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Error reading favorite restaurants from localStorage", error);
      return [];
    }
  });

  const [favoriteMenuItems, setFavoriteMenuItems] = useState<MenuItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = window.localStorage.getItem("favoriteMenuItems");
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Error reading favorite menu items from localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem("favoriteRestaurants", JSON.stringify(favoriteRestaurants));
      } catch (error) {
        console.error("Error writing favorite restaurants to localStorage", error);
      }
    }
  }, [favoriteRestaurants]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem("favoriteMenuItems", JSON.stringify(favoriteMenuItems));
      } catch (error) {
        console.error("Error writing favorite menu items to localStorage", error);
      }
    }
  }, [favoriteMenuItems]);

  const addRestaurantToFavorites = (restaurant: Restaurant) => {
    setFavoriteRestaurants((prev) => [...prev, restaurant]);
    toast({ title: `${restaurant.name} added to favorites!` });
  };

  const removeRestaurantFromFavorites = (restaurantId: string) => {
    const restaurant = favoriteRestaurants.find(r => r.id === restaurantId);
    setFavoriteRestaurants((prev) => prev.filter((r) => r.id !== restaurantId));
    if (restaurant) {
      toast({ title: `${restaurant.name} removed from favorites.` });
    }
  };

  const isRestaurantFavorite = (restaurantId: string) => {
    return favoriteRestaurants.some((r) => r.id === restaurantId);
  };

  const addMenuItemToFavorites = (item: MenuItem) => {
    setFavoriteMenuItems((prev) => [...prev, item]);
     toast({ title: `${item.name} added to favorites!` });
  };

  const removeMenuItemFromFavorites = (itemId: string) => {
    const item = favoriteMenuItems.find(i => i.id === itemId);
    setFavoriteMenuItems((prev) => prev.filter((i) => i.id !== itemId));
    if (item) {
     toast({ title: `${item.name} removed from favorites.` });
    }
  };

  const isMenuItemFavorite = (itemId: string) => {
    return favoriteMenuItems.some((i) => i.id === itemId);
  };

  const clearAllFavorites = () => {
    setFavoriteRestaurants([]);
    setFavoriteMenuItems([]);
    toast({ title: "All favorites have been cleared." });
  };

  return (
    <FavoritesContext.Provider
      value={{
        favoriteRestaurants,
        favoriteMenuItems,
        addRestaurantToFavorites,
        removeRestaurantFromFavorites,
        isRestaurantFavorite,
        addMenuItemToFavorites,
        removeMenuItemFromFavorites,
        isMenuItemFavorite,
        clearAllFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};
