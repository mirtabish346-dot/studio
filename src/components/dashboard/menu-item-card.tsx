"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart, type MenuItem } from "@/context/cart-context";
import { useFavorites } from "@/context/favorites-context";
import { PlusCircle, MinusCircle, Plus, Minus, Heart } from "lucide-react";
import Image from "next/image";

interface MenuItemCardProps {
  item: MenuItem;
}

export function MenuItemCard({ item }: MenuItemCardProps) {
  const { addToCart, removeFromCart, getQuantity } = useCart();
  const { isMenuItemFavorite, addMenuItemToFavorites, removeMenuItemFromFavorites } = useFavorites();
  const quantity = getQuantity(item.id);
  const isFavorite = isMenuItemFavorite(item.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFavorite) {
      removeMenuItemFromFavorites(item.id);
    } else {
      addMenuItemToFavorites(item);
    }
  };

  return (
    <Card className="flex flex-col">
      <CardContent className="p-4 flex gap-4">
        <div className="relative h-24 w-24 rounded-md overflow-hidden flex-shrink-0">
          <Image
            src={
              item.image || "https://picsum.photos/seed/placeholder-item/150/150"
            }
            alt={item.name}
            fill
            className="object-cover"
            data-ai-hint={item.imageHint || "food item"}
          />
        </div>
        <div className="flex flex-col flex-1">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold">{item.name}</h3>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleFavoriteClick}>
              <Heart className={cn("h-5 w-5", isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground")} />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground flex-1">
            {item.description}
          </p>
          <div className="flex justify-between items-center mt-2">
            <span className="font-bold">${item.price.toFixed(2)}</span>
            {quantity === 0 ? (
              <Button size="sm" onClick={() => addToCart(item)}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8"
                  onClick={() => removeFromCart(item.id)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="font-bold">{quantity}</span>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8"
                  onClick={() => addToCart(item)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function cn(arg0: string, arg1: string): string | undefined {
  return [arg0, arg1].filter(Boolean).join(' ');
}
