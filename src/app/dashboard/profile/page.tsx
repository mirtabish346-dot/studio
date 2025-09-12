
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
import { MoreVertical, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ProfilePage() {
  return (
    <div className="grid gap-6">
       <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            Update your personal details here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" defaultValue={userProfile.name} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue={userProfile.email} readOnly />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number (Optional)</Label>
              <Input id="phone" type="tel" defaultValue={userProfile.phone} />
            </div>
          </form>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button>Save Changes</Button>
        </CardFooter>
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
            {userProfile.addresses.map(address => (
                <div key={address.id} className="flex items-center justify-between rounded-lg border p-4">
                    <div className="grid gap-1">
                        <p className="font-semibold flex items-center gap-2">
                            {address.type}
                            {address.isDefault && <Badge variant="secondary">Default</Badge>}
                        </p>
                        <p className="text-sm text-muted-foreground">{address.line1}</p>
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
