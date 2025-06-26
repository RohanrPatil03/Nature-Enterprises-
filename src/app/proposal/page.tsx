
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
        <div className="w-full max-w-4xl space-y-6 bg-white shadow-lg print:shadow-none print:space-y-0">
            <div className="flex justify-end p-6 print:hidden">
                <Button onClick={() => window.print()}>
                    <Printer className="mr-2 h-4 w-4" />
                    Print / Save as PDF
                </Button>
            </div>
            
            {/* Page 1 */}
            <main className="p-8 sm:p-12 font-sans text-sm">
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

                <section className="mt-8">
                    <p><span className="font-bold">Subject:</span> Proposal for the design, supply, installation, commissioning and support of a {systemSize.toFixed(2)}kW Roof Top Solar System</p>
                </section>

                <section className="mt-6 space-y-4 text-gray-800 leading-relaxed text-justify">
                    <p>Hello Sir/Madam,</p>
                    <p>Thank you for taking interest in investing in solar energy. We are an Indo-Australian Solar Energy business with <span className="font-bold">local presence since 2016</span>. We have helped over <span className="font-bold">500 customers</span> harness solar energy to reduce their energy bills and save environment. We strongly believe in working to improve living standards of poor and middle-class families across India. We are doing this by generating local employment for unemployed youth and by <span className="font-bold">conveniently providing affordable & reliable</span> solar energy solutions.</p>
                    <p>Together we can make difference to Global Warming. This is a <span className="font-bold">long-term investment</span> and a project that will help not only you, but also the movement towards a sustainable energy future. Producing <span className="font-bold">your own clean energy</span> is a major step to having an energy-independence, a future which draws closer each day.</p>
                    <p>As the cost of energy from power grids continues to rise each year, many businesses/households are seeking long-term alternatives to reduce their energy bills. Solar energy is a <span className="font-bold">great alternative</span> to the power from the electricity grid and saves thousands of rupees substantially in the long run while also benefiting the environment.</p>
                    <p>We have conducted a detailed study of your energy requirements, site details, sunlight at the site to design a solar energy equipment. In this proposal, we have included details regarding the expected impact that a Solar system will have on your overall energy costs. You'll also find information showing payback period of the system given your current and projected energy use, and what your savings beyond that point will be.</p>
                    <p>We appreciate your consideration of our proposal and hope to build a long-term relationship with you. If you have any questions, please do not hesitate to contact us & when you are comfortable to proceed with the project, please do sign Purchase Order at the end of this document and return it to us.</p>
                </section>

                <section className="mt-8">
                    <p>Regards,</p>
                    <p className="font-bold mt-4">Solar Consultant</p>
                    <p>Director of Marketing</p>
                    <p>Mobile: +1 (555) 123-4567</p>
                    <p>Email: info@nature-enterprises.com</p>
                    <p>Website: www.nature-enterprises.com</p>
                </section>

                <footer className="mt-12 pt-4 border-t-2 border-blue-800 text-center relative">
                    <p className="font-bold text-blue-800">A MAHADISCOM, MNRE & MEDA Registered Partner!</p>
                    <p className="absolute right-0 bottom-0 text-xs text-gray-500">Page 1 of 10</p>
                </footer>
            </main>

            {/* Page 2 */}
            <main className="p-8 sm:p-12 font-sans text-sm print:break-before-page">
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

                <section className="mt-8 space-y-4 text-gray-800 leading-relaxed text-justify">
                    <p>नमस्कार सर/मॅडम,</p>
                    <p>सौरऊर्जेमध्ये गुंतवणूक करण्यात रस घेतल्याब‌द्दल धन्यवाद. आम्ही इंडो-ऑस्ट्रेलियन सौर ऊर्जा व्यवसाय आहोत. 2016 पासून आपल्या लोकल एरियामध्ये काम करत आहोत. आतापर्यंत आम्ही 500 हून अधिक ग्राहकांना त्यांचे वीज बिल कमी करण्यासाठी आणि पर्यावरण वाचवण्यासाठी सौरऊर्जा वापरण्यास मदत केली आहे. गरीब आणि मध्यमवर्गीय कुटुंबांचे जीवनमान सुधारण्यासाठी काम करण्यावर आमचा ठाम विश्वास आहे. त्यासाठी आम्ही बेरोजगार तरुणांसाठी स्थानिक रोजगार निर्माण करतो आणि परवडणारी आणि विश्वासार्ह सौरऊर्जा यंत्रणा सोयीस्करपणे उपलब्ध करून देतो.</p>
                    <p>एकत्रितपणे आपण ग्लोबल वॉर्मिंगमुळे होणारा हवामानातील बदल थांबवू शकतो. ही एक दीर्घकालीन गुंतवणूक आहे जी केवळ तुम्हालाच नाही तर सर्वाना शाश्वत ऊर्जा भविष्याच्या दिशेने वाटचाल करण्यास मदत करेल. तुमची स्वतः वीज निर्माण करणे ही ऊर्जा-स्वातंत्र्य मिळविण्यासाठी टाकलेले एक प्रमुख पाऊल आहे.</p>
                    <p>विजेची किंमत दरवर्षी वाढत असल्याने, अनेक व्यवसाय/घरे त्यांचे वीज बिल कमी करण्यासाठी दीर्घकालीन पर्याय शोधत आहेत. सौरऊर्जा हा एक उत्तम पर्याय आहे जो दीर्घकाळासाठी हजारो रुपयांची बचत करतो आणि ज्याचा पर्यावरणालाही फायदा होतो.</p>
                    <p>सौरऊर्जा उपकरणे डिझाइन करण्यासाठी आम्ही तुमच्या ऊर्जेच्या गरजा, साइटचे तपशील, साइटवरील सूर्यप्रकाश यांचा तपशीलवार अभ्यास केला आहे. या प्रस्तावात, आम्ही सौर यंत्रणेचा तुमच्या एकूण वीज खर्चावर होणारा अपेक्षित परिणाम समाविष्ट केला आहे. तुमचा सध्याचा आणि अंदाजित वीज वापर आणि त्यापलीकडे तुमची बचत काय असेल, या प्रणालीचा परतावा कालावधी दर्शविणारी माहिती देखील दिलेली आहे.</p>
                    <p>आमच्या प्रस्तावाचा तुम्ही विचार करावा अशी आम्ही विनंती करतो आणि तुमच्यासोबत दीर्घकालीन व्यावसायिक संबंध निर्माण करण्याची आशा करतो. आपल्याला काही प्रश्न असल्यास, कृपया आमच्याशी संपर्क साधण्यास अजिबात संकोच करू नका.</p>
                </section>

                <section className="mt-8">
                    <p>धन्यवाद,</p>
                    <p className="font-bold mt-4">सुरज पाटील</p>
                    <p>मार्केटिंग डायरेक्टर</p>
                </section>

                <footer className="mt-12 pt-4 border-t-2 border-blue-800 text-center relative">
                    <p className="font-bold text-blue-800">अनुभवी, नामांकित व अधिकृत व्हेंडर "अफोर्डेबल सोलार एनर्जी" सोबत सौरवीज निर्मिती करा व प्रदूषण मुक्त व्हा!</p>
                    <p className="absolute right-0 bottom-0 text-xs text-gray-500">Page 2 of 10</p>
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
