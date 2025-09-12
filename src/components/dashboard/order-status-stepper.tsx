"use client";

import { cn } from "@/lib/utils";
import { Check, Loader, Bike, CookingPot } from "lucide-react";

const steps = [
  { name: "Order Placed", icon: Check },
  { name: "Preparing", icon: CookingPot },
  { name: "Out for Delivery", icon: Bike },
  { name: "Delivered", icon: Check },
];

export function OrderStatusStepper({ currentStatus }: { currentStatus: string }) {
  const currentStepIndex = steps.findIndex((step) => step.name === currentStatus);

  return (
    <div className="flex items-center justify-between w-full">
      {steps.map((step, index) => {
        const isActive = index <= currentStepIndex;
        const isCurrent = index === currentStepIndex;
        const Icon = step.icon;

        return (
          <div key={step.name} className="flex items-center flex-1 relative">
            <div className="flex flex-col items-center gap-2 z-10">
              <div
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full border-2",
                  isActive
                    ? "bg-primary border-primary text-primary-foreground"
                    : "bg-secondary border-border"
                )}
              >
                <Icon className={cn("w-5 h-5", isCurrent && "animate-pulse")} />
              </div>
              <p
                className={cn(
                  "text-xs text-center",
                  isActive ? "font-semibold" : "text-muted-foreground"
                )}
              >
                {step.name}
              </p>
            </div>

            {index < steps.length - 1 && (
              <div className="absolute top-5 left-1/2 w-full h-0.5 bg-border -translate-y-1/2">
                <div
                  className={cn(
                    "h-full bg-primary transition-all duration-500",
                    isActive ? "w-full" : "w-0"
                  )}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
