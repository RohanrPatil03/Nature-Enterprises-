'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import Link from 'next/link';
import { getProposals, ProposalDocument } from '@/services/proposalService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
            } finally {
                setLoading(false);
            }
        }
        fetchProposals();
    }, []);

    const generateProposalUrl = (proposal: ProposalDocument) => {
        const params = new URLSearchParams();
        Object.entries(proposal).forEach(([key, value]) => {
            if (key !== 'id' && key !== 'createdAt' && value !== undefined && value !== null) {
                params.append(key, value.toString());
            }
        });
        return `/proposal?${params.toString()}`;
    };

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
                                <TableHead className="hidden md:table-cell text-center">Date Added</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
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
                                    <TableCell className="hidden md:table-cell text-center">
                                        {proposal.createdAt ? format(proposal.createdAt.toDate(), 'PP') : 'N/A'}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button asChild variant="outline" size="sm">
                                            <Link href={generateProposalUrl(proposal)}>
                                                View Proposal
                                                <ArrowUpRight className="ml-2 h-4 w-4" />
                                            </Link>
                                        </Button>
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
