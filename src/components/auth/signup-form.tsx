
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp, updateDoc } from "firebase/firestore";

const baseFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({
    message: "Please enter a valid email.",
  }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  role: z.enum(["customer", "provider"], {
    required_error: "You must select a role.",
  }),
});

const providerDetailsSchema = z.object({
    partnerType: z.enum(["restaurant", "pharmacy", "rider", "grocery"], { required_error: "Please select a partner type."}),
    restaurantName: z.string().optional(),
    gstNumber: z.string().optional(),
    pharmacyName: z.string().optional(),
    medicalLicense: z.string().optional(),
    vehicleType: z.string().optional(),
    licenseNumber: z.string().optional(),
    shopName: z.string().optional(),
    phoneNumber: z.string().min(1, "Phone number is required"),
    address: z.string().min(1, "Address is required"),
}).refine(data => {
    if (data.partnerType === 'restaurant') {
        return !!data.restaurantName && !!data.gstNumber;
    }
    if (data.partnerType === 'pharmacy') {
        return !!data.pharmacyName && !!data.medicalLicense;
    }
    if (data.partnerType === 'rider') {
        return !!data.vehicleType && !!data.licenseNumber;
    }
    if (data.partnerType === 'grocery') {
        return !!data.shopName && !!data.gstNumber;
    }
    return false;
}, {
    message: "Please fill all required fields for the selected partner type.",
    path: ['partnerType'],
});


export function SignupForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"initial" | "providerDetails" | "pendingMessage">("initial");
  const [userUid, setUserUid] = useState<string | null>(null);

  const form = useForm<z.infer<typeof baseFormSchema>>({
    resolver: zodResolver(baseFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "customer",
    },
  });

  const providerForm = useForm<z.infer<typeof providerDetailsSchema>>({
    resolver: zodResolver(providerDetailsSchema),
    defaultValues: {
        partnerType: undefined,
        restaurantName: "",
        gstNumber: "",
        pharmacyName: "",
        medicalLicense: "",
        vehicleType: "",
        licenseNumber: "",
        shopName: "",
        phoneNumber: "",
        address: "",
    }
  });

  async function onInitialSubmit(values: z.infer<typeof baseFormSchema>) {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;

      const userDocRef = doc(db, "users", user.uid);
      const userData = {
        name: values.name,
        email: values.email,
        role: values.role,
        createdAt: serverTimestamp(),
      };

      if (values.role === "provider") {
        await setDoc(userDocRef, { ...userData, status: "pending" });
        setUserUid(user.uid);
        setStep("providerDetails");
      } else {
        await setDoc(userDocRef, userData);
        toast({
          title: "Account Created!",
          description: "Welcome to OmniServe!",
        });
        router.push("/dashboard");
      }
    } catch (error: any) {
        toast({
            title: "Signup Failed",
            description: error.message || "An unexpected error occurred.",
            variant: "destructive"
        });
    } finally {
        setIsLoading(false);
    }
  }

  async function onProviderDetailsSubmit(values: z.infer<typeof providerDetailsSchema>) {
    if (!userUid) {
        toast({ title: "Error", description: "User session not found.", variant: "destructive"});
        return;
    }
    setIsLoading(true);
    try {
        const userDocRef = doc(db, "users", userUid);
        await updateDoc(userDocRef, values);
        setStep("pendingMessage");
    } catch (error: any) {
         toast({
            title: "Submission Failed",
            description: error.message || "Could not save provider details.",
            variant: "destructive"
        });
    } finally {
        setIsLoading(false);
    }
  }

  if (step === "pendingMessage") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Application Submitted</CardTitle>
          <CardDescription>Thank you for your interest!</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Your application to become a service provider is under review. You
            will receive an email notification once our admin team has approved
            your account.
          </p>
          <Button onClick={() => router.push("/")} className="mt-4 w-full">
            Back to Home
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (step === "providerDetails") {
    const partnerType = providerForm.watch("partnerType");
    return (
        <Card>
            <CardHeader>
                <CardTitle>Service Provider Details</CardTitle>
                <CardDescription>Please provide some additional information about your business.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...providerForm}>
                    <form onSubmit={providerForm.handleSubmit(onProviderDetailsSubmit)} className="grid gap-4">
                        <FormField
                            control={providerForm.control}
                            name="partnerType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Partner Type</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select your business type" />
                                        </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="restaurant">Restaurant Owner</SelectItem>
                                            <SelectItem value="pharmacy">Pharmacy Owner</SelectItem>
                                            <SelectItem value="rider">Rider</SelectItem>
                                            <SelectItem value="grocery">Grocery Shop Owner</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {partnerType && (
                            <>
                                {partnerType === "restaurant" && (
                                    <>
                                        <FormField control={providerForm.control} name="restaurantName" render={({ field }) => (<FormItem><FormLabel>Restaurant Name</FormLabel><FormControl><Input placeholder="e.g. Milano's Pizzeria" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                        <FormField control={providerForm.control} name="gstNumber" render={({ field }) => (<FormItem><FormLabel>GST Number</FormLabel><FormControl><Input placeholder="e.g. 22AAAAA0000A1Z5" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                    </>
                                )}
                                {partnerType === "pharmacy" && (
                                    <>
                                        <FormField control={providerForm.control} name="pharmacyName" render={({ field }) => (<FormItem><FormLabel>Pharmacy Name</FormLabel><FormControl><Input placeholder="e.g. Quick Meds" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                        <FormField control={providerForm.control} name="medicalLicense" render={({ field }) => (<FormItem><FormLabel>Medical License Number</FormLabel><FormControl><Input placeholder="e.g. 12345/ABC" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                    </>
                                )}
                                {partnerType === "rider" && (
                                    <>
                                        <FormField control={providerForm.control} name="vehicleType" render={({ field }) => (<FormItem><FormLabel>Type of Vehicle</FormLabel><FormControl><Input placeholder="e.g. Scooter, Motorcycle" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                        <FormField control={providerForm.control} name="licenseNumber" render={({ field }) => (<FormItem><FormLabel>Driver's License Number</FormLabel><FormControl><Input placeholder="e.g. DL-1420110012345" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                    </>
                                )}
                                 {partnerType === "grocery" && (
                                    <>
                                        <FormField control={providerForm.control} name="shopName" render={({ field }) => (<FormItem><FormLabel>Name of Shop</FormLabel><FormControl><Input placeholder="e.g. Fresh Mart" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                        <FormField control={providerForm.control} name="gstNumber" render={({ field }) => (<FormItem><FormLabel>GST Number</FormLabel><FormControl><Input placeholder="e.g. 22AAAAA0000A1Z5" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                    </>
                                )}
                                <FormField control={providerForm.control} name="phoneNumber" render={({ field }) => (<FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input type="tel" placeholder="e.g. 9876543210" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={providerForm.control} name="address" render={({ field }) => (<FormItem><FormLabel>Address</FormLabel><FormControl><Textarea placeholder="Full business or personal address" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            </>
                        )}
                        <Button type="submit" className="w-full" disabled={isLoading || !partnerType}>
                             {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                             Submit Application
                        </Button>
                         <Button variant="link" size="sm" onClick={() => setStep("initial")} className="text-muted-foreground">Back</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onInitialSubmit)} className="grid gap-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
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
                <Input placeholder="name@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>I am a...</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="customer">Customer</SelectItem>
                  <SelectItem value="provider">Service Provider (Restaurant, Pharmacy, etc.)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Account
        </Button>
      </form>
    </Form>
  );
}
