'use client';

import { useSearchParams } from 'next/navigation';
import React, { Suspense, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Printer } from 'lucide-react';
import { Logo } from '@/components/logo';

function ProposalContent() {
  const searchParams = useSearchParams();
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString('en-GB'));
  }, []);

  const name = searchParams.get('name') || 'N/A';
  const address = searchParams.get('address') || 'N/A';
  const systemSize = parseFloat(searchParams.get('systemSize') || '0');

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8 flex justify-center print:bg-white">
        <div className="w-full max-w-4xl space-y-6 bg-white shadow-lg print:shadow-none">
            <div className="flex justify-end p-6 print:hidden">
                <Button onClick={() => window.print()}>
                    <Printer className="mr-2 h-4 w-4" />
                    Print / Save as PDF
                </Button>
            </div>
            
            <main className="p-8 sm:p-12 font-sans text-sm">
                {/* Header */}
                <header className="flex justify-between items-start pb-4 border-b-2 border-red-600">
                    <div className="w-1/3">
                        <Logo />
                    </div>
                    <div className="text-right text-xs space-y-1">
                        <h2 className="font-bold text-base">Nature Enterprises</h2>
                        <p>123 Renewable Way, Green City, 12345</p>
                        <p>Phone: +1 (555) 123-4567</p>
                        <p>Web: www.nature-enterprises.com</p>
                        <p>CIN: U12345XX2024PTC123456</p>
                        <p>MNRE Empanelment No. MNRE/CP/GCRT/X/1234</p>
                    </div>
                </header>

                {/* Recipient Info */}
                <section className="mt-8 flex justify-between">
                    <div>
                        <p className="font-bold">To: {name}</p>
                        <p>{address}</p>
                    </div>
                    <div className="text-right">
                        <p><span className="font-bold">Date:</span> {currentDate || '...'}</p>
                    </div>
                </section>
                
                <div className="text-center my-4">
                    <p className="font-bold text-red-600 tracking-wider">CONFIDENTIAL</p>
                </div>

                {/* Subject */}
                <section className="mt-8">
                    <p><span className="font-bold">Subject:</span> Proposal for the design, supply, installation, commissioning and support of a {systemSize.toFixed(2)}kW Roof Top Solar System</p>
                </section>

                {/* Body */}
                <section className="mt-6 space-y-4 text-gray-800 leading-relaxed">
                    <p>Hello Sir/Madam,</p>
                    <p>Thank you for taking interest in investing in solar energy. We are an Indo-Australian Solar Energy business with <span className="font-bold">local presence since 2016</span>. We have helped over <span className="font-bold">500 customers</span> harness solar energy to reduce their energy bills and save environment. We strongly believe in working to improve living standards of poor and middle-class families across India. We are doing this by generating local employment for unemployed youth and by <span className="font-bold">conveniently providing affordable & reliable</span> solar energy solutions.</p>
                    <p>Together we can make difference to Global Warming. This is a <span className="font-bold">long-term investment</span> and a project that will help not only you, but also the movement towards a sustainable energy future. Producing <span className="font-bold">your own clean energy</span> is a major step to having an energy-independence, a future which draws closer each day.</p>
                    <p>As the cost of energy from power grids continues to rise each year, many businesses/households are seeking long-term alternatives to reduce their energy bills. Solar energy is a <span className="font-bold">great alternative</span> to the power from the electricity grid and saves thousands of rupees substantially in the long run while also benefiting the environment.</p>
                    <p>We have conducted a detailed study of your energy requirements, site details, sunlight at the site to design a solar energy equipment. In this proposal, we have included details regarding the expected impact that a Solar system will have on your overall energy costs. You'll also find information showing payback period of the system given your current and projected energy use, and what your savings beyond that point will be.</p>
                    <p>We appreciate your consideration of our proposal and hope to build a long-term relationship with you. If you have any questions, please do not hesitate to contact us & when you are comfortable to proceed with the project, please do sign Purchase Order at the end of this document and return it to us.</p>
                </section>

                {/* Closing */}
                <section className="mt-8">
                    <p>Regards,</p>
                    <p className="font-bold mt-4">Solar Consultant</p>
                    <p>Director of Marketing</p>
                    <p>Mobile: +1 (555) 123-4567</p>
                    <p>Email: info@nature-enterprises.com</p>
                    <p>Website: www.nature-enterprises.com</p>
                </section>

                {/* Footer */}
                <footer className="mt-12 pt-4 border-t-2 border-blue-800 text-center">
                    <p className="font-bold text-blue-800">A MAHADISCOM, MNRE & MEDA Registered Partner!</p>
                </footer>
            </main>
        </div>
    </div>
  );
}

function ProposalSkeleton() {
    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8 flex justify-center">
            <div className="w-full max-w-4xl space-y-6">
                <Skeleton className="h-10 w-48 ml-auto" />
                <div className="p-4 sm:p-8 md:p-12 border rounded-lg bg-white">
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
                    <div className="my-8">
                       <Skeleton className="h-8 w-full mb-6" />
                       <Skeleton className="h-4 w-full" />
                       <Skeleton className="h-4 w-full mt-2" />
                       <Skeleton className="h-4 w-3/4 mt-2" />
                    </div>
                </div>
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
