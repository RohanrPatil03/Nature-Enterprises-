'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2 } from "lucide-react";

const proposalFormSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  systemSize: z.coerce.number().positive({ message: 'System size must be a positive number.' }),
  monthlyBill: z.coerce.number().positive({ message: 'Monthly bill must be a positive number.' }),
});

export default function ProposalGeneratorPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  
  const form = useForm<z.infer<typeof proposalFormSchema>>({
    resolver: zodResolver(proposalFormSchema),
    defaultValues: {
      name: '',
      systemSize: undefined,
      monthlyBill: undefined,
    },
  });

  function onSubmit(values: z.infer<typeof proposalFormSchema>) {
    setIsSubmitting(true);
    const params = new URLSearchParams({
      name: values.name,
      systemSize: values.systemSize.toString(),
      monthlyBill: values.monthlyBill.toString(),
    });
    router.push(`/proposal?${params.toString()}`);
  }

  return (
    <Card className="max-w-2xl mx-auto">
        <CardHeader>
            <CardTitle className="font-headline">Generate a Proposal</CardTitle>
            <CardDescription>
                Fill in the customer's details below to generate a printable PDF proposal.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                  name="systemSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>System Size (kW)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="5" {...field} step="0.1" />
                      </FormControl>
                       <FormDescription>
                        Enter the total kilowatt capacity of the solar panel system.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="monthlyBill"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Average Monthly Electricity Bill (₹)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="10000" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter the customer's average monthly bill in Indian Rupees.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    'Generate Proposal'
                  )}
                </Button>
              </form>
            </Form>
        </CardContent>
    </Card>
  );
}
