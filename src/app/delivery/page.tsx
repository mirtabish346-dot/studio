import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge";

const assignedOrders = [
    {
      id: "ORDER-003",
      restaurantName: "Burger Barn",
      customerAddress: "456 Oak Ave, Anytown",
      status: "Out for Delivery",
    },
    {
        id: "ORDER-004",
        restaurantName: "Sushi House",
        customerAddress: "789 Pine St, Anytown",
        status: "Preparing",
    }
]

export default function DeliveryPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Assigned Deliveries
        </h1>
        <p className="text-muted-foreground">
          Here are your current tasks.
        </p>
      </div>
      <div className="flex flex-col gap-4">
        {assignedOrders.map(order => (
            <Card key={order.id}>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Order: {order.id}</CardTitle>
                        <CardDescription>From: {order.restaurantName}</CardDescription>
                        <CardDescription>To: {order.customerAddress}</CardDescription>
                    </div>
                    <Badge variant="default">{order.status}</Badge>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4">
                        <p className="text-sm font-medium">Update Status:</p>
                        <Select defaultValue={order.status}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Picked Up">Picked Up</SelectItem>
                                <SelectItem value="Out for Delivery">Out for Delivery</SelectItem>
                                <SelectItem value="Delivered">Delivered</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>
        ))}
      </div>
    </div>
  );
}
