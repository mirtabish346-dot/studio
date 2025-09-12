"use client";

import { userOrders, menus } from "@/lib/data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Repeat } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { useToast } from "@/hooks/use-toast";

export default function OrdersPage() {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const allMenuItems = Object.values(menus).flatMap((menu) => menu.items);

  const handleReorder = (orderId: string) => {
    const order = userOrders.find((o) => o.id === orderId);
    if (!order || !order.items) return;

    let itemsAddedCount = 0;
    order.items.forEach(orderItem => {
      const menuItem = allMenuItems.find(item => item.id === orderItem.itemId);
      if (menuItem) {
        for(let i = 0; i < orderItem.quantity; i++) {
          addToCart(menuItem);
        }
        itemsAddedCount += orderItem.quantity;
      }
    });

    if (itemsAddedCount > 0) {
      toast({
        title: "Items Added to Cart",
        description: `${itemsAddedCount} item(s) from order ${orderId} have been added to your cart with current pricing.`,
      });
    } else {
       toast({
        title: "Reorder Failed",
        description: `Could not find items from order ${orderId} in the current menu.`,
        variant: "destructive"
      });
    }

  };


  return (
    <Card>
      <CardHeader>
        <CardTitle>My Orders</CardTitle>
        <CardDescription>
          A list of your past and current orders.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Restaurant</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.restaurantName}</TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>${order.total.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      order.status === "Delivered" ? "secondary" : "default"
                    }
                  >
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="flex gap-2 justify-end">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/dashboard/orders/${order.id}`}>
                      View Details
                    </Link>
                  </Button>
                  {order.status === "Delivered" && (
                     <Button variant="outline" size="sm" onClick={() => handleReorder(order.id)}>
                        <Repeat className="mr-2 h-4 w-4" />
                        Reorder
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
