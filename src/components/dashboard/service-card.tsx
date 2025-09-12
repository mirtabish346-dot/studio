import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { LucideIcon } from "lucide-react";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  disabled: boolean;
}

export function ServiceCard({
  title,
  description,
  icon: Icon,
  href,
  disabled,
}: ServiceCardProps) {
  const CardContent = (
    <Card className="hover:shadow-lg transition-shadow duration-300 h-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <Icon className="h-10 w-10 mb-4 text-primary" />
          {disabled && <Badge variant="secondary">Coming Soon</Badge>}
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  );

  if (disabled) {
    return (
      <div className="cursor-not-allowed opacity-60">
        {CardContent}
      </div>
    );
  }

  return <Link href={href}>{CardContent}</Link>;
}
