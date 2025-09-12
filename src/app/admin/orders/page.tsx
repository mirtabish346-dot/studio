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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge";
import { adminOrders, deliveryPartners } from "@/lib/data";

export default function AdminOrdersPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Orders</CardTitle>
        <CardDescription>View and manage all customer orders.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Restaurant</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assign Delivery</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {adminOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.customer || 'Customer User'}</TableCell>
                <TableCell>{order.restaurantName}</TableCell>
                <TableCell>${order.total.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge variant={order.status === 'Delivered' ? 'secondary' : 'default'}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {order.deliveryPartner === 'Unassigned' ? (
                     <Select>
                     <SelectTrigger className="w-[180px]">
                       <SelectValue placeholder="Assign Partner" />
                     </SelectTrigger>
                     <SelectContent>
                        {deliveryPartners.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                     </SelectContent>
                   </Select>
                  ) : (
                    order.deliveryPartner
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
