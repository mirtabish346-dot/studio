import { userOrders, restaurants } from "@/lib/data";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { OrderStatusStepper } from "@/components/dashboard/order-status-stepper";

export default function OrderDetailsPage({
  params,
}: {
  params: { orderId: string };
}) {
  const order = userOrders.find((o) => o.id === params.orderId);

  if (!order) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Order Tracking</CardTitle>
          <CardDescription>
            Order ID: {order.id} | Placed on {order.date}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-8">
            <OrderStatusStepper currentStatus={order.status} />
          
            <Separator />

            <div>
                <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
                <div className="flex justify-between">
                    <span>{order.restaurantName}</span>
                    <span className="font-medium">${order.total.toFixed(2)}</span>
                </div>
                <p className="text-sm text-muted-foreground">Status: {order.status}</p>
            </div>
            
            <Separator />

            <div>
                 <h3 className="text-lg font-semibold mb-2">Leave a Review</h3>
                 <p className="text-sm text-muted-foreground">Feature coming soon.</p>
            </div>

        </CardContent>
      </Card>
    </div>
  );
}
