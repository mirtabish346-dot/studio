import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";

interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  image: string;
  imageHint: string;
}

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <Link href={`/dashboard/food-delivery/${restaurant.id}`}>
      <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="p-0">
          <div className="relative h-48 w-full">
            <Image
              src={restaurant.image}
              alt={restaurant.name}
              fill
              className="object-cover"
              data-ai-hint={restaurant.imageHint}
            />
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <CardTitle className="text-lg font-headline mb-1">{restaurant.name}</CardTitle>
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>{restaurant.cuisine}</span>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>{restaurant.rating}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
