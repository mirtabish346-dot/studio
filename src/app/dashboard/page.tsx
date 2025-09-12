import { ServiceCard } from "@/components/dashboard/service-card";
import { Utensils, Stethoscope, ShoppingBasket, Truck } from "lucide-react";

const services = [
  {
    title: "Food Delivery",
    description: "Order from your favorite restaurants.",
    icon: Utensils,
    href: "/dashboard/food-delivery",
    disabled: false,
  },
  {
    title: "Medicine",
    description: "Get medicines delivered to your doorstep.",
    icon: Stethoscope,
    href: "#",
    disabled: true,
  },
  {
    title: "Grocery",
    description: "Shop for your daily needs.",
    icon: ShoppingBasket,
    href: "#",
    disabled: true,
  },
  {
    title: "Pick & Drop",
    description: "Send packages across the city.",
    icon: Truck,
    href: "#",
    disabled: true,
  },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          What are you looking for today?
        </h1>
        <p className="text-muted-foreground">
          Select a service to get started.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {services.map((service) => (
          <ServiceCard
            key={service.title}
            title={service.title}
            description={service.description}
            icon={service.icon}
            href={service.href}
            disabled={service.disabled}
          />
        ))}
      </div>
    </div>
  );
}
