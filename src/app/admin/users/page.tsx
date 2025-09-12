
"use client";

import { useState, useEffect } from "react";
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
  import { Button } from "@/components/ui/button";
  import { useToast } from "@/hooks/use-toast";
  import { db } from "@/lib/firebase";
  import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
  import { Loader2 } from "lucide-react";

  interface User {
      id: string;
      name: string;
      email: string;
      role: string;
      registered: string;
      status?: string;
      partnerType?: string;
      [key: string]: any; // Allow other properties
  }

  const providerRolesDisplay: Record<string, string> = {
    'restaurant': 'Restaurant Owner',
    'pharmacy': 'Pharmacy Owner',
    'rider': 'Rider',
    'grocery': 'Grocery Shop Owner'
  }

  export default function AdminUsersPage() {
    const [filter, setFilter] = useState("All users");
    const { toast } = useToast();
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const fetchUsers = async () => {
        setIsLoading(true);
        try {
          const usersCollection = collection(db, "users");
          const userSnapshot = await getDocs(usersCollection);
          const userList = userSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              name: data.name || 'N/A',
              email: data.email || 'N/A',
              role: data.role || 'N/A',
              status: data.status,
              registered: data.createdAt?.toDate().toLocaleDateString() || new Date().toLocaleDateString(),
              ...data
            };
          });
          setUsers(userList);
        } catch (error) {
          console.error("Error fetching users: ", error);
          toast({
            title: "Error",
            description: "Failed to fetch users from the database.",
            variant: "destructive",
          });
        }
        setIsLoading(false);
      };

      fetchUsers();
    }, [toast]);

    const handleApprove = async (userId: string, userName: string) => {
        try {
            const userDocRef = doc(db, 'users', userId);
            await updateDoc(userDocRef, { status: 'approved' });
            setUsers(prevUsers => prevUsers.map(u => u.id === userId ? { ...u, status: 'approved' } : u));
            toast({
                title: "Provider Approved",
                description: `An email has been sent to ${userName} notifying them of their approval.`,
            });
        } catch (error) {
             toast({
                title: "Error",
                description: "Failed to approve provider.",
                variant: "destructive",
            });
        }
    }

    const handleReject = async (userId: string, userName: string) => {
        try {
            const userDocRef = doc(db, 'users', userId);
            await updateDoc(userDocRef, { status: 'rejected' });
            setUsers(prevUsers => prevUsers.map(u => u.id === userId ? { ...u, status: 'rejected' } : u));
            toast({
                title: "Provider Rejected",
                description: `An email has been sent to ${userName} notifying them of their rejection.`,
                variant: "destructive",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to reject provider.",
                variant: "destructive",
            });
        }
    }

    const sortedUsers = [...users].sort((a, b) => {
        if (a.status === 'pending' && b.status !== 'pending') return -1;
        if (a.status !== 'pending' && b.status === 'pending') return 1;
        return 0;
    });

    const filteredUsers = () => {
        switch (filter) {
            case "All users":
                return sortedUsers;
            case "Applications":
                return sortedUsers.filter(u => u.status === "pending" && u.role === "provider");
            case "Customers":
                return sortedUsers.filter(u => u.role === "customer");
            case "Restaurant Owners":
                return sortedUsers.filter(u => u.role === "provider" && u.partnerType === "restaurant" && u.status === "approved");
            case "Riders":
                return sortedUsers.filter(u => u.role === "provider" && u.partnerType === "rider" && u.status === "approved");
            case "Pharmacy Owners":
                return sortedUsers.filter(u => u.role === "provider" && u.partnerType === "pharmacy" && u.status === "approved");
            case "Grocery Shop Owners":
                return sortedUsers.filter(u => u.role === "provider" && u.partnerType === "grocery" && u.status === "approved");
            default:
                return sortedUsers;
        }
    }
    
    const getRoleDisplay = (user: User) => {
      if (user.role === 'provider') {
        if (user.status === 'pending') {
          return `Application (${providerRolesDisplay[user.partnerType || ''] || user.partnerType})`;
        }
        return providerRolesDisplay[user.partnerType || ''] || user.partnerType;
      }
      return user.role.charAt(0).toUpperCase() + user.role.slice(1);
    }

    const filters = [
        "All users",
        "Applications",
        "Customers",
        "Restaurant Owners",
        "Riders",
        "Pharmacy Owners",
        "Grocery Shop Owners"
    ];

    return (
      <Card>
        <CardHeader>
          <CardTitle>Manage Users</CardTitle>
          <CardDescription>View and manage all platform users and applications.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
                {filters.map(f => (
                     <Button key={f} variant={filter === f ? "default" : "outline"} onClick={() => setFilter(f)}>
                        {f}
                    </Button>
                ))}
            </div>
          {isLoading ? (
             <div className="flex justify-center items-center h-48">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
             </div>
          ) : (
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>User/App ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role/Type</TableHead>
                    <TableHead>Registered</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {filteredUsers().map((user) => (
                    <TableRow key={user.id}>
                    <TableCell className="font-medium text-xs">{user.id}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{getRoleDisplay(user)}</TableCell>
                    <TableCell>{user.registered}</TableCell>
                    <TableCell>
                        {user.status === "pending" ? (
                        <div className="flex gap-2">
                            <Button size="sm" onClick={() => handleApprove(user.id, user.name)}>Approve</Button>
                            <Button variant="destructive" size="sm" onClick={() => handleReject(user.id, user.name)}>
                            Reject
                            </Button>
                        </div>
                        ) : (
                        <span className="text-xs text-muted-foreground">No actions</span>
                        )}
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    );
  }
