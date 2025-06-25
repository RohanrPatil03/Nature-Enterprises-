'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { getProposals, ProposalDocument } from '@/services/proposalService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Users } from 'lucide-react';

export default function CustomersPage() {
    const [proposals, setProposals] = useState<ProposalDocument[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProposals() {
            try {
                const data = await getProposals();
                setProposals(data);
            } catch (error) {
                console.error(error);
                // TODO: Add user-facing error message, e.g., using a toast
            } finally {
                setLoading(false);
            }
        }
        fetchProposals();
    }, []);

    return (
        <Card>
            <CardHeader>
                <CardTitle>All Customers</CardTitle>
                <CardDescription>A list of all customer proposals that have been generated.</CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="space-y-2">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                ) : proposals.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground">
                        <Users className="mx-auto h-12 w-12" />
                        <p className="mt-4">No customers have been added yet.</p>
                        <p className="text-sm">Start by creating a new proposal from the dashboard.</p>
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Customer Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead className="hidden md:table-cell">Address</TableHead>
                                <TableHead className="text-right">Date Added</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {proposals.map((proposal) => (
                                <TableRow key={proposal.id}>
                                    <TableCell className="font-medium">{proposal.name}</TableCell>
                                    <TableCell>
                                        <Badge variant={proposal.customerType === 'Commercial' ? 'default' : 'secondary'}>
                                          {proposal.customerType}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">{proposal.address}</TableCell>
                                    <TableCell className="text-right">
                                        {proposal.createdAt ? format(proposal.createdAt.toDate(), 'PP') : 'N/A'}
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
