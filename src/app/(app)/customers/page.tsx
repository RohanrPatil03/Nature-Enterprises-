
'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import Link from 'next/link';
import { getProposals, deleteProposal, ProposalDocument } from '@/services/proposalService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, ArrowUpRight, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

export default function CustomersPage() {
    const [proposals, setProposals] = useState<ProposalDocument[]>([]);
    const [loading, setLoading] = useState(true);
    const [proposalToDelete, setProposalToDelete] = useState<ProposalDocument | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        async function fetchProposals() {
            try {
                const data = await getProposals();
                setProposals(data);
            } catch (error) {
                console.error(error);
                 toast({
                    title: "Error fetching customers",
                    description: "Could not fetch customer data. Please try again later.",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        }
        fetchProposals();
    }, [toast]);

    const generateProposalUrl = (proposal: ProposalDocument) => {
        const params = new URLSearchParams();
        Object.entries(proposal).forEach(([key, value]) => {
            if (key !== 'id' && key !== 'createdAt' && value !== undefined && value !== null) {
                params.append(key, value.toString());
            }
        });
        return `/proposal?${params.toString()}`;
    };

    const handleDelete = async () => {
        if (!proposalToDelete) return;

        try {
            await deleteProposal(proposalToDelete.id);
            setProposals(proposals.filter(p => p.id !== proposalToDelete.id));
            toast({
                title: "Customer Deleted",
                description: `Successfully deleted ${proposalToDelete.name}.`,
            });
        } catch (error) {
            console.error("Failed to delete proposal", error);
            toast({
                title: "Error",
                description: "Failed to delete customer. Please try again.",
                variant: "destructive",
            });
        } finally {
            setProposalToDelete(null);
        }
    };

    return (
        <>
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
                                        <TableCell className="text-right space-x-2">
                                            <Button asChild variant="outline" size="sm">
                                                <Link href={generateProposalUrl(proposal)}>
                                                    View Proposal
                                                    <ArrowUpRight className="ml-2 h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button variant="destructive" size="icon" onClick={() => setProposalToDelete(proposal)}>
                                                <Trash className="h-4 w-4" />
                                                <span className="sr-only">Delete customer</span>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            <AlertDialog open={!!proposalToDelete} onOpenChange={(open) => !open && setProposalToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the customer
                            <span className="font-semibold"> {proposalToDelete?.name}</span> and all associated data.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setProposalToDelete(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
