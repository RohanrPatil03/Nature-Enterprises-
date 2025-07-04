
'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { saveProposal } from "@/services/proposalService";
import { Skeleton } from '@/components/ui/skeleton';

const proposalFormSchema = z.object({
  customerType: z.enum(['Residential', 'Commercial'], {
    required_error: 'You must select a customer type.',
  }),
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  consumerNumber: z.string().min(1, { message: 'Please enter a consumer number.' }),
  connectionType: z.string().min(1, { message: 'Please select a connection type.' }),
  address: z.string().min(5, {
    message: 'Please enter a valid address.',
  }),
  load: z.coerce.number().positive({ message: 'Connected load must be a positive number.' }),
  systemSize: z.coerce.number().positive({ message: 'System size must be a positive number.' }),
  monthlyBill: z.coerce.number().positive({ message: 'Monthly bill must be a positive number.' }),
  roofSize: z.coerce.number().positive({ message: 'Roof size must be a positive number.' }),
  installationLocation: z.enum(['Roof Mounted', 'Ground Mounted'], {
    required_error: 'You must select an installation location.',
  }),
  systemCost: z.coerce.number().positive({ message: 'System cost must be a positive number.' }),
  incentives: z.coerce.number().nonnegative({ message: 'Subsidy must be a non-negative number.' }).default(0),
  inverterCapacity: z.string().min(1, { message: 'Please enter inverter capacity.' }),
});

function ProposalGeneratorForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const customerTypeParam = searchParams.get('customerType');
  
  const form = useForm<z.infer<typeof proposalFormSchema>>({
    resolver: zodResolver(proposalFormSchema),
    defaultValues: {
      customerType: customerTypeParam === 'Commercial' ? 'Commercial' : 'Residential',
      name: 'rp',
      consumerNumber: '123456789012',
      connectionType: 'Single Phase',
      address: '123 Solar Way, Sunnyvale, CA 94086',
      load: 5,
      systemSize: 5,
      monthlyBill: 5000,
      roofSize: 700,
      installationLocation: 'Roof Mounted',
      systemCost: 300000,
      incentives: 78000,
      inverterCapacity: '5.00kW',
    },
  });

  async function onSubmit(values: z.infer<typeof proposalFormSchema>) {
    setIsSubmitting(true);
    try {
      await saveProposal(values);
      toast({
        title: "Success!",
        description: "Customer details have been saved.",
      });
      router.push('/dashboard');
    } catch (error) {
        console.error(error);
        toast({
            title: "Error Saving Customer",
            description: "Could not save the customer. Please try again.",
            variant: "destructive",
        });
    } finally {
        setIsSubmitting(false);
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
        <CardHeader>
            <CardTitle className="font-headline">Add New Customer</CardTitle>
            <CardDescription>
                Fill in the customer's details below. This data will be saved for proposal generation and other operations.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="customerType"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Customer Type</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex items-center space-x-6"
                        >
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="Residential" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Residential
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="Commercial" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Commercial
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="consumerNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Consumer Number</FormLabel>
                      <FormControl>
                        <Input placeholder="284840008604" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter the customer's consumer number(s), separated by commas if multiple.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="connectionType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Connection Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a connection type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Single Phase">Single Phase</SelectItem>
                          <SelectItem value="Three Phase">Three Phase</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Solar Lane, Sun City" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormField
                    control={form.control}
                    name="load"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Connected Load (kW)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="3" {...field} value={field.value ?? ''} step="0.1" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="monthlyBill"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Average Monthly Bill (₹)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="10000" {...field} value={field.value ?? ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <FormField
                    control={form.control}
                    name="roofSize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Roof Size (sq. ft.)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="600" {...field} value={field.value ?? ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="systemSize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Proposed System Size (kW)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="5" {...field} value={field.value ?? ''} step="0.1" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="installationLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location of Installation</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a location" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Roof Mounted">Roof Mounted</SelectItem>
                          <SelectItem value="Ground Mounted">Ground Mounted</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                    control={form.control}
                    name="systemCost"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Design & Installation Cost (₹)</FormLabel>
                        <FormControl>
                        <Input type="number" placeholder="300000" {...field} value={field.value ?? ''} />
                        </FormControl>
                        <FormDescription>
                            Enter the total all-inclusive cost for the system.
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="incentives"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Subsidy Amount (₹)</FormLabel>
                        <FormControl>
                        <Input type="number" placeholder="78000" {...field} value={field.value ?? ''} />
                        </FormControl>
                        <FormDescription>
                            Enter the government subsidy amount, if applicable.
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                 <div className="space-y-2">
                    <h3 className="text-lg font-medium">Bill of Materials</h3>
                    <div className="p-4 border rounded-lg space-y-6">
                        <FormField
                            control={form.control}
                            name="inverterCapacity"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Grid Tie Inverter Capacity</FormLabel>
                                <FormControl>
                                <Input placeholder="5.00kW" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Enter the capacity of the inverter as it should appear on the proposal (e.g., 5.00kW).
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </div>
                 </div>


                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving Customer...
                    </>
                  ) : (
                    'Save Customer'
                  )}
                </Button>
              </form>
            </Form>
        </CardContent>
    </Card>
  );
}

function ProposalGeneratorSkeleton() {
    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <Skeleton className="h-7 w-48 mb-2" />
                <Skeleton className="h-4 w-full" />
            </CardHeader>
            <CardContent className="space-y-8 pt-6">
                <div className="space-y-3">
                    <Skeleton className="h-5 w-24" />
                    <div className="flex items-center space-x-6">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-6 w-32" />
                    </div>
                </div>
                <div className="space-y-2"><Skeleton className="h-5 w-32" /><Skeleton className="h-10 w-full" /></div>
                <div className="space-y-2"><Skeleton className="h-5 w-32" /><Skeleton className="h-10 w-full" /></div>
                <div className="space-y-2"><Skeleton className="h-5 w-32" /><Skeleton className="h-10 w-full" /></div>
                <Skeleton className="h-10 w-40" />
            </CardContent>
        </Card>
    );
}

export default function ProposalGeneratorPage() {
    return (
        <Suspense fallback={<ProposalGeneratorSkeleton />}>
            <ProposalGeneratorForm />
        </Suspense>
    );
}
