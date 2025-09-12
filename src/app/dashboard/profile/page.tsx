"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { userProfile } from "@/lib/data";
import { Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

const profileFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email(),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => val === "" || val?.match(/^\d{10}$/),
      "Phone number must be 10 digits."
    ),
});

export default function ProfilePage() {
  const { toast } = useToast();
  const initialPhone = userProfile.phone.startsWith("+91")
    ? userProfile.phone.substring(3)
    : userProfile.phone;

  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: userProfile.name,
      email: userProfile.email,
      phone: initialPhone,
    },
  });

  function onSubmit(values: z.infer<typeof profileFormSchema>) {
    toast({
      title: "Changes Saved!",
      description: "Your profile information has been updated.",
    });
    console.log(values);
  }

  return (
    <div className="grid gap-6">
      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details here.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" readOnly {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number (Optional)</FormLabel>
                    <div className="flex items-center">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-background text-sm text-muted-foreground h-10">
                        +91
                      </span>
                      <FormControl>
                        <Input
                          type="tel"
                          className="rounded-l-none"
                          placeholder="9876543210"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button type="submit">Save Changes</Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Saved Addresses</CardTitle>
            <CardDescription>
              Manage your shipping and billing addresses.
            </CardDescription>
          </div>
          <Button>Add New Address</Button>
        </CardHeader>
        <CardContent className="grid gap-4">
          {userProfile.addresses.map((address) => (
            <div
              key={address.id}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div className="grid gap-1">
                <div className="font-semibold flex items-center gap-2">
                  {address.type}
                  {address.isDefault && (
                    <Badge variant="secondary">Default</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {address.line1}
                </p>
                <p className="text-sm text-muted-foreground">{`${address.city}, ${address.pincode}`}</p>
              </div>
              <Button variant="ghost" size="icon">
                <Trash2 className="h-5 w-5 text-destructive" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
