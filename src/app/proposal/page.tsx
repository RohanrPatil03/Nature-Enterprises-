'use client';

import { useSearchParams } from 'next/navigation';
import React, { Suspense, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Logo } from '@/components/logo';
import { Printer } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

function ProposalContent() {
  const searchParams = useSearchParams();
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString());
  }, []);

  const name = searchParams.get('name') || 'N/A';
  const address = searchParams.get('address') || 'N/A';
  const load = parseFloat(searchParams.get('load') || '0');
  const systemSize = parseFloat(searchParams.get('systemSize') || '0');
  const monthlyBill = parseFloat(searchParams.get('monthlyBill') || '0');
  const roofSize = parseFloat(searchParams.get('roofSize') || '0');
  const panelType = searchParams.get('panelType') || 'N/A';
  
  const systemCost = systemSize * 70000; // Example: ₹70,000 per kW
  const yearlySavings = monthlyBill * 12;
  const paybackPeriod = yearlySavings > 0 ? systemCost / yearlySavings : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 flex justify-center">
        <div className="w-full max-w-4xl space-y-6">
            <div className="flex justify-end print:hidden">
                <Button onClick={() => window.print()}>
                    <Printer className="mr-2" />
                    Print / Save as PDF
                </Button>
            </div>
            <Card className="p-4 sm:p-8 md:p-12 print:shadow-none print:border-none">
                <header className="flex justify-between items-start pb-8 border-b">
                    <div>
                        <Logo />
                        <p className="text-muted-foreground mt-2">Your Partner in Renewable Energy</p>
                    </div>
                    <div className="text-right">
                         <h1 className="text-3xl font-bold font-headline text-primary">Solar Proposal</h1>
                         <p className="text-muted-foreground">Date: {currentDate || '...'}</p>
                    </div>
                </header>
                
                <section className="my-8">
                    <h2 className="text-xl font-semibold font-headline mb-2">Prepared For:</h2>
                    <p className="text-lg font-bold">{name}</p>
                    <p className="text-muted-foreground">{address}</p>
                </section>

                <Separator className="my-8" />
                
                <section>
                    <h2 className="text-2xl font-bold font-headline mb-6 text-center text-primary">Site & System Details</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        <div className="rounded-lg border bg-card text-card-foreground p-4">
                            <h3 className="text-sm text-muted-foreground font-medium">Connected Load</h3>
                            <p className="text-2xl font-bold">{load.toFixed(1)} kW</p>
                        </div>
                         <div className="rounded-lg border bg-card text-card-foreground p-4">
                            <h3 className="text-sm text-muted-foreground font-medium">Roof Size</h3>
                            <p className="text-2xl font-bold">{roofSize.toLocaleString('en-IN')} sq. ft.</p>
                        </div>
                        <div className="rounded-lg border bg-card text-card-foreground p-4">
                            <h3 className="text-sm text-muted-foreground font-medium">Proposed System</h3>
                            <p className="text-2xl font-bold">{systemSize.toFixed(1)} kW</p>
                        </div>
                        <div className="rounded-lg border bg-card text-card-foreground p-4">
                            <h3 className="text-sm text-muted-foreground font-medium">Panel Type</h3>
                            <p className="text-2xl font-bold">{panelType}</p>
                        </div>
                    </div>
                </section>

                <Separator className="my-8" />

                <section>
                    <h2 className="text-2xl font-bold font-headline mb-6 text-center text-primary">Financial Overview</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg text-muted-foreground font-medium">Estimated Cost</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold">₹{systemCost.toLocaleString('en-IN')}</p>
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader>
                                <CardTitle className="text-lg text-muted-foreground font-medium">Yearly Savings</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold">₹{yearlySavings.toLocaleString('en-IN')}</p>
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader>
                                <CardTitle className="text-lg text-muted-foreground font-medium">Payback Period</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold">{paybackPeriod > 0 ? paybackPeriod.toFixed(1) : 'N/A'} years</p>
                            </CardContent>
                        </Card>
                    </div>
                </section>
                
                <Separator className="my-8" />

                <section>
                    <h2 className="text-xl font-semibold font-headline mb-4">Disclaimer</h2>
                    <p className="text-sm text-muted-foreground">
                        This is a preliminary proposal based on the information you provided. All figures are estimates. Actual system cost, energy production, and financial returns may vary based on a detailed site assessment, final system design, available incentives, and your electricity usage. This document is not a binding contract.
                    </p>
                </section>

                <footer className="mt-12 pt-6 border-t text-center text-xs text-muted-foreground">
                    <p>Thank you for considering Nature Enterprises!</p>
                    <p>www.green-energy-example.com | (123) 456-7890</p>
                </footer>
            </Card>
        </div>
    </div>
  );
}

function ProposalSkeleton() {
    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8 flex justify-center">
            <div className="w-full max-w-4xl space-y-6">
                <Skeleton className="h-10 w-48 ml-auto" />
                <Card className="p-4 sm:p-8 md:p-12">
                    <div className="flex justify-between items-start pb-8 border-b">
                        <div>
                            <Skeleton className="h-8 w-40 mb-2" />
                            <Skeleton className="h-4 w-60" />
                        </div>
                         <div className="text-right">
                             <Skeleton className="h-9 w-48 mb-2" />
                             <Skeleton className="h-4 w-24" />
                        </div>
                    </div>
                    <div className="my-8">
                        <Skeleton className="h-6 w-40 mb-2" />
                        <Skeleton className="h-5 w-32" />
                    </div>
                    <Separator className="my-8" />
                    <Skeleton className="h-8 w-1/2 mx-auto mb-6" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card><CardContent className="p-6"><Skeleton className="h-24 w-full" /></CardContent></Card>
                        <Card><CardContent className="p-6"><Skeleton className="h-24 w-full" /></CardContent></Card>
                        <Card><CardContent className="p-6"><Skeleton className="h-24 w-full" /></CardContent></Card>
                    </div>
                </Card>
            </div>
        </div>
    );
}

export default function ProposalPage() {
  return (
    <Suspense fallback={<ProposalSkeleton />}>
      <ProposalContent />
    </Suspense>
  )
}
