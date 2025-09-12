"use client";

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
  import { Badge } from "@/components/ui/badge";
  import { Button } from "@/components/ui/button";
  import { adminProviders } from "@/lib/data";
  import { useToast } from "@/hooks/use-toast";
  
  export default function AdminProvidersPage() {
    const { toast } = useToast();

    const handleApprove = (providerName: string) => {
        toast({
            title: "Provider Approved",
            description: `An email has been sent to ${providerName} notifying them of their approval.`,
        });
    }

    const handleReject = (providerName: string) => {
        toast({
            title: "Provider Rejected",
            description: `An email has been sent to ${providerName} notifying them of their rejection.`,
            variant: "destructive",
        });
    }

    const sortedProviders = [...adminProviders].sort((a, b) => {
        if (a.status === 'Pending' && b.status !== 'Pending') return -1;
        if (a.status !== 'Pending' && b.status === 'Pending') return 1;
        return 0;
    });

    return (
      <Card>
        <CardHeader>
          <CardTitle>Manage Providers</CardTitle>
          <CardDescription>Approve or deny new service partner applications.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Provider ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedProviders.map((provider) => (
                <TableRow key={provider.id}>
                  <TableCell className="font-medium">{provider.id}</TableCell>
                  <TableCell>{provider.name}</TableCell>
                  <TableCell>{provider.type}</TableCell>
                  <TableCell className="text-xs">{provider.details}</TableCell>
                  <TableCell>{provider.joined}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        provider.status === "Approved"
                          ? "default"
                          : provider.status === "Pending"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {provider.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {provider.status === "Pending" ? (
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleApprove(provider.name)}>Approve</Button>
                        <Button variant="destructive" size="sm" onClick={() => handleReject(provider.name)}>
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
        </CardContent>
      </Card>
    );
  }
  