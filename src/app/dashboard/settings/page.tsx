
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { userProfile } from "@/lib/data";

export default function SettingsPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [deleteConfirmationEmail, setDeleteConfirmationEmail] = useState("");
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

  const handleDeleteAccount = () => {
    if (deleteConfirmationEmail !== userProfile.email) {
      toast({
        title: "Incorrect Email",
        description: "The email you entered does not match your account's email.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Account Deleted",
      description: "Your account has been successfully deleted.",
      variant: "destructive",
    });
    setDeleteConfirmationEmail("");
    setIsDeleteAlertOpen(false);
    router.push("/");
  };

  const handleNotificationToggle = (checked: boolean) => {
    setNotificationsEnabled(checked);
    toast({
      title: "Settings Saved",
      description: `Notifications have been ${
        checked ? "enabled" : "disabled"
      }.`,
    });
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>
            Manage your notification preferences.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="notifications-switch" className="flex flex-col space-y-1">
              <span>Enable Notifications</span>
              <span className="font-normal leading-snug text-muted-foreground">
                Receive updates about your orders and promotions.
              </span>
            </Label>
            <Switch
              id="notifications-switch"
              checked={notificationsEnabled}
              onCheckedChange={handleNotificationToggle}
            />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Account Management</CardTitle>
          <CardDescription>
            Permanent actions regarding your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Deleting your account will permanently remove all your data,
            including your order history and saved addresses. This action
            cannot be undone.
          </p>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete Account</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. To confirm, please type your
                  email address (<span className="font-medium text-foreground">{userProfile.email}</span>) below.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="py-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={deleteConfirmationEmail}
                  onChange={(e) => setDeleteConfirmationEmail(e.target.value)}
                />
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setDeleteConfirmationEmail('')}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirmationEmail !== userProfile.email}
                >
                  Yes, delete my account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
    </div>
  );
}
