import { ServiceCard } from "@/components/dashboard/service-card";
import {
  UtensilsCrossed,
  ShoppingCart,
  Pill,
  Package,
} from "lucide-react";

export default function DashboardPage() {
  const services = [
    {
      title: "Food Delivery",
      description: "Order from your favorite local restaurants.",
      icon: UtensilsCrossed,
      href: "/dashboard/food-delivery",
      disabled: false,
    },
    {
      title: "Grocery",
      description: "Get your groceries delivered to your doorstep.",
      icon: ShoppingCart,
      href: "#",
      disabled: true,
    },
    {
      title: "Medicine",
      description: "Essential medicines delivered quickly.",
      icon: Pill,
      href: "#",
      disabled: true,
    },
    {
      title: "Pick & Drop",
      description: "Send packages anywhere in the city.",
      icon: Package,
      href: "#",
      disabled: true,
    },
  ];

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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
