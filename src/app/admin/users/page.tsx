
"use client";

import { useState } from "react";
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
  import { adminUsers, adminProviders } from "@/lib/data";
  import { Button } from "@/components/ui/button";

  const providerRoles: Record<string, string> = {
    'Restaurant': 'Restaurant Owner',
    'Pharmacy': 'Pharmacy Owner',
    'Rider': 'Rider',
    'Grocery': 'Grocery Shop Owner'
  }

  export default function AdminUsersPage() {
    const [filter, setFilter] = useState("All users");

    const usersWithProviderRoles = adminUsers.map(user => {
      const provider = adminProviders.find(p => p.name === user.name);
      if (provider) {
        return { ...user, role: providerRoles[provider.type] || user.role };
      }
      return user;
    });

    const pendingApplications = adminProviders.filter(p => p.status === "Pending").map(p => ({
        id: p.id,
        name: p.name,
        email: 'N/A', // Email not in provider data
        role: `Application (${p.type})`,
        registered: p.joined,
    }));


    const filteredUsers = () => {
        switch (filter) {
            case "All users":
                return usersWithProviderRoles;
            case "Applications":
                return pendingApplications;
            case "Customers":
                return usersWithProviderRoles.filter(u => u.role === "Customer");
            case "Restaurant Owners":
                return usersWithProviderRoles.filter(u => u.role === "Restaurant Owner");
            case "Riders":
                return usersWithProviderRoles.filter(u => u.role === "Rider");
            case "Pharmacy Owners":
                return usersWithProviderRoles.filter(u => u.role === "Pharmacy Owner");
            case "Grocery Shop Owners":
                return usersWithProviderRoles.filter(u => u.role === "Grocery Shop Owner");
            default:
                return usersWithProviderRoles;
        }
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
          <CardDescription>View and manage all platform users.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
                {filters.map(f => (
                     <Button key={f} variant={filter === f ? "default" : "outline"} onClick={() => setFilter(f)}>
                        {f}
                    </Button>
                ))}
            </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Registered</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers().map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.registered}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  }
  
