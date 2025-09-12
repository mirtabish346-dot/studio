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
  
  export default function AdminProvidersPage() {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Manage Service Providers</CardTitle>
          <CardDescription>Approve or deny new service providers.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Provider ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {adminProviders.map((provider) => (
                <TableRow key={provider.id}>
                  <TableCell className="font-medium">{provider.id}</TableCell>
                  <TableCell>{provider.name}</TableCell>
                  <TableCell>{provider.type}</TableCell>
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
                        <Button size="sm">Approve</Button>
                        <Button variant="destructive" size="sm">
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
  