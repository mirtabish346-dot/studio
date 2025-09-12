"use client";

import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function CheckoutPage() {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const router = useRouter();
  const { toast } = useToast();

  const total = getCartTotal();
  const tax = total * 0.08;
  const deliveryFee = 5.0;
  const grandTotal = total + tax + deliveryFee;

  const handlePlaceOrder = () => {
    toast({
      title: "Order Placed!",
      description: "Thank you for your order. You can track its status now.",
    });
    clearCart();
    router.push("/dashboard/orders/ORDER-003");
  };

  if (cartItems.length === 0) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold">Your cart is empty.</h1>
        <p className="text-muted-foreground">Add some items to proceed to checkout.</p>
        <Button onClick={() => router.push("/dashboard")} className="mt-4">
          Browse Restaurants
        </Button>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-8 items-start">
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Delivery Address</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="address">Street Address</Label>
              <Input id="address" defaultValue="123 Main St" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" defaultValue="Anytown" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="pincode">Pincode</Label>
                <Input id="pincode" defaultValue="12345" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
            <CardContent className="p-0">
                <Image 
                    src="https://picsum.photos/seed/map/800/400"
                    alt="Map Preview"
                    width={800}
                    height={400}
                    className="w-full h-auto rounded-lg"
                    data-ai-hint="street map"
                />
            </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
             <div className="grid gap-2">
              <Label htmlFor="card-number">Card Number</Label>
              <Input id="card-number" placeholder="**** **** **** 1234" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="expiry">Expiry</Label>
                <Input id="expiry" placeholder="MM/YY" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cvc">CVC</Label>
                <Input id="cvc" placeholder="123" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="sticky top-24">
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <p>${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
            <Separator />
            <div className="flex justify-between">
              <p>Subtotal</p>
              <p>${total.toFixed(2)}</p>
            </div>
            <div className="flex justify-between">
              <p>Tax (8%)</p>
              <p>${tax.toFixed(2)}</p>
            </div>
            <div className="flex justify-between">
              <p>Delivery Fee</p>
              <p>${deliveryFee.toFixed(2)}</p>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <p>Total</p>
              <p>${grandTotal.toFixed(2)}</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={handlePlaceOrder}>Place Order</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
