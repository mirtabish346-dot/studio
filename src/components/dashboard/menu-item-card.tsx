"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart, type MenuItem } from "@/context/cart-context";
import { PlusCircle } from "lucide-react";
import Image from "next/image";

interface MenuItemCardProps {
  item: MenuItem;
}

export function MenuItemCard({ item }: MenuItemCardProps) {
  const { addToCart } = useCart();

  return (
    <Card className="flex flex-col">
      <CardContent className="p-4 flex gap-4">
         <div className="relative h-24 w-24 rounded-md overflow-hidden flex-shrink-0">
          <Image
            src={item.image || "https://picsum.photos/seed/placeholder-item/150/150"}
            alt={item.name}
            fill
            className="object-cover"
            data-ai-hint={item.imageHint || "food item"}
          />
        </div>
        <div className="flex flex-col flex-1">
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-sm text-muted-foreground flex-1">
            {item.description}
          </p>
          <div className="flex justify-between items-center mt-2">
            <span className="font-bold">${item.price.toFixed(2)}</span>
            <Button size="sm" onClick={() => addToCart(item)}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
