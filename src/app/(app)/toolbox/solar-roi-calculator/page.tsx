'use client';

import { useState } from 'react';
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
import { Separator } from '@/components/ui/separator';
import { IndianRupee } from 'lucide-react';

const roiFormSchema = z.object({
  systemCost: z.coerce.number().positive({ message: 'System cost must be a positive number.' }),
  monthlyBill: z.coerce.number().positive({ message: 'Monthly bill must be a positive number.' }),
  incentives: z.coerce.number().nonnegative({ message: 'Incentives must be a non-negative number.' }).default(0),
});

type RoiFormValues = z.infer<typeof roiFormSchema>;

interface RoiResults {
  yearlySavings: number;
  netSystemCost: number;
  paybackPeriod: number;
  roi25Year: number;
}

export default function SolarRoiCalculatorPage() {
  const [results, setResults] = useState<RoiResults | null>(null);

  const form = useForm<RoiFormValues>({
    resolver: zodResolver(roiFormSchema),
    defaultValues: {
      systemCost: undefined,
      monthlyBill: undefined,
      incentives: 0,
    },
  });

  function onSubmit(values: RoiFormValues) {
    const { systemCost, monthlyBill, incentives } = values;
    
    const yearlySavings = monthlyBill * 12;
    const netSystemCost = systemCost - incentives;
    const paybackPeriod = yearlySavings > 0 ? netSystemCost / yearlySavings : Infinity;
    
    const lifetimeYears = 25;
    const totalSavings = yearlySavings * lifetimeYears;
    const roi25Year = netSystemCost > 0 ? ((totalSavings - netSystemCost) / netSystemCost) * 100 : Infinity;

    setResults({
      yearlySavings,
      netSystemCost,
      paybackPeriod,
      roi25Year,
    });
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Solar ROI Calculator</CardTitle>
          <CardDescription>
            Enter the details below to estimate the return on investment.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="systemCost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total System Cost (₹)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="350000" {...field} />
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
                    <FormLabel>Average Monthly Electricity Bill (₹)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="4000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="incentives"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subsidies & Incentives (₹)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="78000" {...field} />
                    </FormControl>
                     <FormDescription>
                        Enter the total amount of any government subsidies or tax credits.
                      </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Calculate ROI</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle className="font-headline">Estimated Results</CardTitle>
          <CardDescription>
            These are preliminary estimates and can vary.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col justify-center">
          {results ? (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Estimated Yearly Savings</p>
                <p className="text-3xl font-bold text-primary">₹{results.yearlySavings.toLocaleString('en-IN')}</p>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-sm text-muted-foreground">Payback Period</p>
                  <p className="text-2xl font-bold">
                    {isFinite(results.paybackPeriod) ? `${results.paybackPeriod.toFixed(1)} years` : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">25-Year ROI</p>
                  <p className="text-2xl font-bold">
                     {isFinite(results.roi25Year) ? `${results.roi25Year.toFixed(0)}%` : 'N/A'}
                  </p>
                </div>
              </div>
               <Separator />
               <div className="text-center">
                <p className="text-sm text-muted-foreground">Net System Cost</p>
                <p className="text-xl font-bold">₹{results.netSystemCost.toLocaleString('en-IN')}</p>
              </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-10">
              <IndianRupee className="mx-auto h-12 w-12" />
              <p className="mt-4">Your results will appear here.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
