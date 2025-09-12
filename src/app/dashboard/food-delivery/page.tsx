import { RestaurantCard } from "@/components/dashboard/restaurant-card";
import { restaurants } from "@/lib/data";

export default function FoodDeliveryPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Restaurants Near You
        </h1>
        <p className="text-muted-foreground">
          Choose from a wide variety of cuisines.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {restaurants.map((restaurant) => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} />
        ))}
      </div>
    </div>
  );
}
