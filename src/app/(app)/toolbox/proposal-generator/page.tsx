
'use client';

import { useState } from 'react';
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

const proposalFormSchema = z.object({
  customerType: z.enum(['Residential', 'Commercial'], {
    required_error: 'You must select a customer type.',
  }),
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  connectionType: z.string().min(1, { message: 'Please select a connection type.' }),
  address: z.string().min(5, {
    message: 'Please enter a valid address.',
  }),
  load: z.coerce.number().positive({ message: 'Load must be a positive number.' }),
  systemSize: z.coerce.number().positive({ message: 'System size must be a positive number.' }),
  monthlyBill: z.coerce.number().positive({ message: 'Monthly bill must be a positive number.' }),
  roofSize: z.coerce.number().positive({ message: 'Roof size must be a positive number.' }),
  panelType: z.string().min(1, { message: 'Please select a panel type.' }),
});

export default function ProposalGeneratorPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const customerTypeParam = searchParams.get('customerType');
  
  const form = useForm<z.infer<typeof proposalFormSchema>>({
    resolver: zodResolver(proposalFormSchema),
    defaultValues: {
      customerType: customerTypeParam === 'Commercial' ? 'Commercial' : 'Residential',
      name: '',
      connectionType: '',
      address: '',
      load: undefined,
      systemSize: undefined,
      monthlyBill: undefined,
      roofSize: undefined,
      panelType: '',
    },
  });

  async function onSubmit(values: z.infer<typeof proposalFormSchema>) {
    setIsSubmitting(true);
    try {
      await saveProposal(values);
      toast({
        title: "Success!",
        description: "The proposal has been saved to your database.",
      });

      const params = new URLSearchParams({
        ...Object.fromEntries(Object.entries(values).map(([key, value]) => [key, String(value)])),
      });
      router.push(`/proposal?${params.toString()}`);

    } catch (error) {
        console.error(error);
        toast({
            title: "Error Saving Proposal",
            description: "Could not save the proposal. Please ensure your Firebase configuration in src/lib/firebase.ts is correct and try again.",
            variant: "destructive",
        });
        setIsSubmitting(false);
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
        <CardHeader>
            <CardTitle className="font-headline">Generate a Proposal</CardTitle>
            <CardDescription>
                Fill in the customer's details below. The data will be saved automatically and a printable proposal will be generated.
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
                  name="panelType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Panel Type</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a panel type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Monocrystalline">Monocrystalline</SelectItem>
                          <SelectItem value="Polycrystalline">Polycrystalline</SelectItem>
                          <SelectItem value="Thin-Film">Thin-Film</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Choose the type of solar panel for the installation.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving and Generating...
                    </>
                  ) : (
                    'Save and Generate Proposal'
                  )}
                </Button>
              </form>
            </Form>
        </CardContent>
    </Card>
  );
}
