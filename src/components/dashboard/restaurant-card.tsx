import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Star } from "lucide-react";
import { useFavorites } from "@/context/favorites-context";
import { Button } from "../ui/button";

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
  const { isRestaurantFavorite, addRestaurantToFavorites, removeRestaurantFromFavorites } = useFavorites();
  const isFavorite = isRestaurantFavorite(restaurant.id);
  
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if(isFavorite) {
      removeRestaurantFromFavorites(restaurant.id);
    } else {
      addRestaurantToFavorites(restaurant);
    }
  }

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
       <CardHeader className="p-0 relative">
        <Link href={`/dashboard/food-delivery/${restaurant.id}`}>
            <div className="relative h-48 w-full">
              <Image
                src={restaurant.image}
                alt={restaurant.name}
                fill
                className="object-cover"
                data-ai-hint={restaurant.imageHint}
              />
            </div>
        </Link>
        <Button variant="ghost" size="icon" className="absolute top-2 right-2 bg-background/70 hover:bg-background h-8 w-8" onClick={handleFavoriteClick}>
            <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
        </Button>
      </CardHeader>
      <Link href={`/dashboard/food-delivery/${restaurant.id}`}>
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
      </Link>
    </Card>
  );
}
