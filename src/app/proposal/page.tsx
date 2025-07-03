
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import React, { Suspense, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Download, ArrowLeft } from 'lucide-react';
import { Logo } from '@/components/logo';

const handleSavePdf = () => {
    // This check ensures the code inside only runs in an Electron renderer process
    // where Node.js integration is enabled. It prevents the Next.js build from
    // trying to bundle Node.js modules like 'fs'. We check for `window.require`
    // which is made available by Electron when `nodeIntegration` is true.
    if (typeof window !== 'undefined' && (window as any).require) {
      try {
        const { ipcRenderer } = (window as any).require('electron');
        ipcRenderer.send('save-pdf');
      } catch (error) {
        console.error("Failed to use ipcRenderer, falling back to print.", error);
        window.print();
      }
    } else {
      // If not in Electron (e.g., running in a standard web browser),
      // fall back to the browser's native print functionality.
      console.warn("Electron's ipcRenderer is not available. Falling back to window.print(). This is expected in a web browser environment.");
      window.print();
    }
};

interface ProposalRenderData {
    name: string;
    address: string;
    systemSize: number;
    consumerNumber: string;
    load: number;
    connectionType: string;
    customerType: string;
    monthlyBill: number;
    roofSize: number;
    installationLocation: string;
    inverterCapacity: string;
    designInstallationCost: number;
    incentives: number;
    ppaProcessingCost: number;
    gstPercentage: number;
}

function ProposalContent() {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState('');
  const [data, setData] = useState<ProposalRenderData | null>(null);

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString('en-GB'));
    
    // This component now safely runs only on the client, avoiding hydration errors.
    const params = new URLSearchParams(window.location.search);
    setData({
        name: params.get('name') || 'N/A',
        address: params.get('address') || 'N/A',
        systemSize: parseFloat(params.get('systemSize') || '0'),
        consumerNumber: params.get('consumerNumber') || 'N/A',
        load: parseFloat(params.get('load') || '0'),
        connectionType: params.get('connectionType') || 'N/A',
        customerType: params.get('customerType') || 'N/A',
        monthlyBill: parseFloat(params.get('monthlyBill') || '0'),
        roofSize: parseFloat(params.get('roofSize') || '0'),
        installationLocation: params.get('installationLocation') || 'Roof Mounted',
        inverterCapacity: params.get('inverterCapacity') || '5.00kW',
        designInstallationCost: parseFloat(params.get('systemCost') || '0'),
        incentives: parseFloat(params.get('incentives') || '0'),
        ppaProcessingCost: parseFloat(params.get('ppaProcessingCost') || '0'),
        gstPercentage: parseFloat(params.get('gstPercentage') || '0'),
    });
  }, []);

  if (!data) {
    return <ProposalSkeleton />;
  }

  const { 
    name, address, systemSize, consumerNumber, load, connectionType, customerType,
    monthlyBill, roofSize, installationLocation, inverterCapacity,
    designInstallationCost, incentives, ppaProcessingCost, gstPercentage 
  } = data;

  // Constants for calculations
  const COST_PER_UNIT = 10.05;
  const ANNUAL_TARIFF_ESCALATION = 0.04;
  const SYSTEM_LIFETIME_YEARS = 25;
  const AVG_ANNUAL_UNITS_PER_KW = 1400;

  // Page 4 Calculations
  const avgRequiredMonthlyOutput = monthlyBill / COST_PER_UNIT;
  const avgRequiredAnnualOutput = avgRequiredMonthlyOutput * 12;
  const expectedAnnualOutput = systemSize * AVG_ANNUAL_UNITS_PER_KW;
  const expectedMonthlyOutput = expectedAnnualOutput / 12;
  const expectedMonthlyOutputMin = expectedMonthlyOutput * 0.7;
  const expectedMonthlyOutputMax = expectedMonthlyOutput * 1.2;
  const firstYearSavings = expectedAnnualOutput * COST_PER_UNIT;
  
  let lifetimeValue = 0;
  for (let i = 0; i < SYSTEM_LIFETIME_YEARS; i++) {
    lifetimeValue += expectedAnnualOutput * (COST_PER_UNIT * Math.pow(1 + ANNUAL_TARIFF_ESCALATION, i));
  }
  const netInvestment = designInstallationCost - incentives;
  const costPerUnitWithSolar = designInstallationCost > 0 && expectedAnnualOutput > 0
    ? designInstallationCost / (expectedAnnualOutput * SYSTEM_LIFETIME_YEARS)
    : 0;
  
  // Page 5 Calculations
  const amountPayable = designInstallationCost;

  const formatCurrency = (value: number) => {
    return `₹ ${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
  };
  
  const formatUnits = (value: number) => {
    return `${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })} Units`;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8 flex justify-center print:bg-white">
        <div className="w-full max-w-4xl space-y-6 bg-white shadow-lg print:shadow-none print:space-y-0">
            <div className="flex justify-between items-center p-6 print:hidden">
                <Button onClick={() => router.back()} variant="outline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Go Back
                </Button>
                <Button onClick={handleSavePdf}>
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF to PC
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
                        <p>A/p -Tung  , Sangli,</p>
                        <p>Sangli - Islampur Highway, 416401 .</p>
                        <p>Phone: 9595943332</p>
                        <p>Web: www.nature-enterprises.com</p>
                    </div>
                </header>

                <div className="text-center my-4">
                    <p className="font-bold text-red-600 tracking-wider">CONFIDENTIAL</p>
                </div>
                
                <section className="mt-8 flex justify-between">
                    <div>
                        <p className="font-bold">To: {name}</p>
                        <p>{address}</p>
                    </div>
                    <div className="text-right">
                        <p><span className="font-bold">Date:</span> {currentDate || '...'}</p>
                    </div>
                </section>

                <div className="mt-6">
                    <p><span className="font-bold">Subject:</span> Proposal for a {systemSize.toFixed(2)}kW Rooftop Solar System</p>
                </div>
                
                <section className="mt-6 space-y-4 text-gray-800 leading-relaxed text-justify">
                    <p>Greetings,</p>
                    <p>Thank you sincerely for deciding to install a solar power generation system!</p>
                    <p>We have been actively working in the solar energy sector in your local area since 2017. With rising electricity tariffs, many families and businesses are now seeking alternative solutions. In such a scenario, solar energy is a long-term, eco-friendly, and cost-effective option.</p>
                    <p>We have helped many customers reduce their electricity bills and contribute to protecting the environment. A solar system allows you to save thousands of rupees every year while also playing your part in combating global warming.</p>
                    <p>Generating your own electricity is a major step towards achieving energy independence. It is not only a matter of financial savings but also a responsible investment for a sustainable future.</p>
                    <p>From the very beginning, we have been committed to providing our customers with high-quality products, competitive pricing, fast service, and reliable assurance. Superior quality, fair pricing, and excellent service are our core values.</p>
                    <p>Based on the details of your site, energy requirements, and solar potential, we have designed a suitable solar system specifically for you. Thank you for considering our proposal!</p>
                    <p>If given the opportunity to serve you, we assure you of providing the best and technically sound service.</p>
                    <p>For any queries or further information, please feel free to contact us. We look forward to building a long-term business relationship with you.</p>
                </section>

                <section className="mt-8">
                    <p>Yours sincerely,</p>
                    <p className="font-bold mt-4">Nature Enterprises</p>
                </section>

                <footer className="mt-12 pt-4 border-t-2 border-blue-800 text-center relative">
                    <p className="font-bold text-blue-800">A MAHADISCOM, MNRE &amp; MEDA Registered Partner!</p>
                    <p className="absolute right-0 bottom-0 text-xs text-gray-500">Page 1 of 6</p>
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
                        <p>A/p -Tung  , Sangli,</p>
                        <p>Sangli - Islampur Highway, 416401 .</p>
                        <p>Phone: 9595943332</p>
                        <p>Web: www.nature-enterprises.com</p>
                    </div>
                </header>

                <section className="mt-8 space-y-4 text-gray-800 leading-relaxed text-justify">
                    <p>नमस्कार,</p>
                    <p>सौर ऊर्जा निर्मिती प्रकल्प बसवण्याचा निर्णय घेतल्याबद्दल आपले मनःपूर्वक आभार!</p>
                    <p>आम्ही २०१७ पासून आपल्या लोकल परिसरात सौरऊर्जेच्या क्षेत्रात कार्यरत आहोत. वाढत्या वीज दरामुळे अनेक कुटुंबे व व्यवसाय पर्यायी उपाय शोधत आहेत. अशा परिस्थितीत, सौर ऊर्जा ही दीर्घकालीन, पर्यावरणपूरक व खर्च वाचवणारी उत्तम निवड आहे.</p>
                    <p>आम्ही अनेक ग्राहकांना त्यांचे वीज बिल कमी करण्यात व पर्यावरणाचे रक्षण करण्यात मदत केली आहे. सौर प्रणालीमुळे तुम्ही दरवर्षी हजारो रुपयांची बचत करू शकता आणि त्याचबरोबर ग्लोबल वॉर्मिंग थांबवण्याच्या प्रयत्नात भाग घेऊ शकता.</p>
                    <p>तुमची स्वतःची वीज निर्मिती करणे हे ऊर्जा स्वातंत्र्य मिळवण्यासाठी टाकलेले एक महत्वाचे पाऊल आहे. ही केवळ आर्थिक बचतीची नाही, तर शाश्वत भविष्यासाठीचीही एक जबाबदारी आहे.</p>
                    <p>आम्ही सुरुवातीपासूनच ग्राहकांना उच्च दर्जाची उत्पादने, स्पर्धात्मक दर, जलद सेवा व त्यासोबत विश्वासार्ह आश्वासन देत आलो आहोत. उत्तम गुणवत्ता, योग्य किंमत आणि उत्कृष्ट सेवा हेच आमचे प्रमुख मूल्य आहे.</p>
                    <p>आपल्या जागेचा तपशील, ऊर्जेची गरज आणि सूर्यप्रकाशाचा अभ्यास करून आम्ही तुमच्यासाठी ही सौर प्रणाली डिझाईन केली आहे. आपण आमचा प्रस्ताव विचारात घेतल्याबद्दल धन्यवाद!</p>
                    <p>आम्हाला आपल्याला सेवा देण्याची संधी दिल्यास, आम्ही तुम्हाला सर्वोत्तम व तांत्रिकदृष्ट्या सक्षम सेवा देण्याचे आश्वासन देतो.</p>
                    <p>कोणत्याही शंका किंवा अधिक माहितीसाठी कृपया आमच्याशी संपर्क साधा. आपल्याशी दीर्घकालीन व्यावसायिक संबंध प्रस्थापित करण्याची आम्हाला अपेक्षा आहे.</p>
                </section>

                <section className="mt-8">
                    <p>आपला विश्वासू,</p>
                    <p className="font-bold mt-4">Nature Enterprises</p>
                </section>

                <footer className="mt-12 pt-4 border-t-2 border-blue-800 text-center relative">
                    <p className="font-bold text-blue-800">अनुभवी, नामांकित व अधिकृत व्हेंडर "Nature Enterprises" सोबत सौरवीज निर्मिती करा व प्रदूषण मुक्त व्हा!</p>
                    <p className="absolute right-0 bottom-0 text-xs text-gray-500">Page 2 of 6</p>
                </footer>
            </main>
            
            {/* Page 3 */}
             <main className="p-8 sm:p-12 font-sans text-sm print:break-before-page">
                 <header className="flex justify-between items-start pb-4 border-b-2 border-red-600">
                    <div className="w-1/3">
                        <Logo />
                    </div>
                    <div className="text-right text-xs space-y-1">
                        <h2 className="font-bold text-base">Nature Enterprises</h2>
                        <p>A/p -Tung  , Sangli,</p>
                        <p>Sangli - Islampur Highway, 416401 .</p>
                        <p>Phone: 9595943332</p>
                        <p>Web: www.nature-enterprises.com</p>
                    </div>
                </header>

                <div className="my-8">
                    <h2 className="text-xl font-bold text-blue-800 tracking-wide border-b-2 border-red-600 inline-block pb-1">Report Summary</h2>
                </div>
                
                <section className="mt-8">
                    <table className="w-full border-collapse border border-gray-300 text-left text-sm">
                        <tbody>
                            <tr className="border-b border-gray-300"><td className="p-2 border-r border-gray-300 font-semibold w-1/2 bg-gray-50">Customer Details</td><td className="p-2 font-bold">{name}</td></tr>
                            <tr className="border-b border-gray-300"><td className="p-2 border-r border-gray-300 font-semibold bg-gray-50">Address</td><td className="p-2">{address}</td></tr>
                            <tr className="border-b border-gray-300"><td className="p-2 border-r border-gray-300 font-semibold bg-gray-50">Consumer Number(s)</td><td className="p-2">{consumerNumber}</td></tr>
                            <tr className="border-b border-gray-300"><td className="p-2 border-r border-gray-300 font-semibold bg-gray-50">Connected Load (kW)</td><td className="p-2">{load}</td></tr>
                            <tr className="border-b border-gray-300"><td className="p-2 border-r border-gray-300 font-semibold bg-gray-50">Connection Type</td><td className="p-2">{connectionType}</td></tr>
                            <tr className="border-b border-gray-300"><td className="p-2 border-r border-gray-300 font-semibold bg-gray-50">Customer Type</td><td className="p-2">{customerType}</td></tr>
                            <tr className="border-b border-gray-300"><td className="p-2 border-r border-gray-300 font-semibold bg-gray-50">Proposed System Size (kW)</td><td className="p-2">{systemSize.toFixed(2)}</td></tr>
                            <tr className="border-b border-gray-300"><td className="p-2 border-r border-gray-300 font-semibold bg-gray-50">Average Monthly Bill (₹)</td><td className="p-2">{monthlyBill.toLocaleString('en-IN')}</td></tr>
                            <tr className="border-b border-gray-300"><td className="p-2 border-r border-gray-300 font-semibold bg-gray-50">Roof Size (sq. ft.)</td><td className="p-2">{roofSize}</td></tr>
                            <tr><td className="p-2 border-r border-gray-300 font-semibold bg-gray-50">Location of Installation</td><td className="p-2">{installationLocation}</td></tr>
                        </tbody>
                    </table>
                </section>
                
                 <section className="mt-12">
                    <h3 className="font-bold text-lg text-blue-800 mb-4">Important Notes:</h3>
                    <ul className="list-disc list-inside space-y-2 text-xs text-gray-700">
                        <li>The CFA/Subsidy amount is subject to change as per government policies. We assist in the application process, but the final disbursement is by the government agency.</li>
                        <li>Any additional civil work, wiring beyond the standard scope, or load enhancement charges are the customer's responsibility.</li>
                        <li>The proposal is valid for 7 days from the date of submission.</li>
                    </ul>
                </section>


                <footer className="mt-24 pt-4 border-t-2 border-gray-400 text-center relative">
                    <p className="absolute right-0 bottom-0 text-xs text-gray-500">Page 3 of 6</p>
                </footer>
            </main>

            {/* Page 4 */}
            <main className="p-8 sm:p-12 font-sans text-sm print:break-before-page">
                 <header className="flex justify-between items-start pb-4 border-b-2 border-red-600">
                    <div className="w-1/3">
                        <Logo />
                    </div>
                    <div className="text-right text-xs space-y-1">
                        <h2 className="font-bold text-base">Nature Enterprises</h2>
                        <p>A/p -Tung  , Sangli,</p>
                        <p>Sangli - Islampur Highway, 416401 .</p>
                        <p>Phone: 9595943332</p>
                        <p>Web: www.nature-enterprises.com</p>
                    </div>
                </header>

                <div className="my-4">
                    <h2 className="text-lg font-bold text-blue-800 tracking-wide">Pricing and Payback</h2>
                    <p className="mt-1">खालील टेबल सौर ऊर्जा उपकरणा विषयी सर्व माहिती देते.</p>
                </div>
                
                <section className="mt-8">
                    <table className="w-full border-collapse border border-gray-300 text-left text-xs">
                        <tbody>
                            <tr className="border-b border-gray-300"><td className="p-2 border-r border-gray-300 font-semibold w-1/3">System Capacity</td><td className="p-2 border-r border-gray-300 font-semibold w-1/3">सिस्टिम कपॅसिटी</td><td className="p-2 font-bold">{systemSize.toFixed(2)}kW</td></tr>
                            <tr className="border-b border-gray-300"><td className="p-2 border-r border-gray-300 font-semibold">Required roof space</td><td className="p-2 border-r border-gray-300 font-semibold">छतावर लागणारी जागा</td><td className="p-2">{roofSize.toLocaleString('en-IN')} Sq. feet</td></tr>
                            <tr className="border-b border-gray-300"><td className="p-2 border-r border-gray-300 font-semibold">Average required annual output</td><td className="p-2 border-r border-gray-300 font-semibold">वार्षिक विजेची गरज</td><td className="p-2">{formatUnits(avgRequiredAnnualOutput)}</td></tr>
                            <tr className="border-b border-gray-300"><td className="p-2 border-r border-gray-300 font-semibold">Expected annual output</td><td className="p-2 border-r border-gray-300 font-semibold">वार्षिक विजनिर्माण</td><td className="p-2">{formatUnits(expectedAnnualOutput)}</td></tr>
                            <tr className="border-b border-gray-300"><td className="p-2 border-r border-gray-300 font-semibold">Average required monthly output</td><td className="p-2 border-r border-gray-300 font-semibold">विजेची गरज</td><td className="p-2">{formatUnits(avgRequiredMonthlyOutput)}</td></tr>
                            <tr className="border-b border-gray-300"><td className="p-2 border-r border-gray-300 font-semibold">Expected monthly output</td><td className="p-2 border-r border-gray-300 font-semibold">विजनिर्माण</td><td className="p-2">{formatUnits(expectedMonthlyOutput)}</td></tr>
                            <tr><td className="p-2 border-r border-gray-300 font-semibold">Expected monthly output range</td><td className="p-2 border-r border-gray-300 font-semibold">विजनिर्माण</td><td className="p-2">{formatUnits(expectedMonthlyOutputMin)} to {formatUnits(expectedMonthlyOutputMax)}</td></tr>
                        </tbody>
                    </table>
                </section>

                <footer className="mt-12 pt-4 text-center relative">
                    <p className="absolute right-0 bottom-0 text-xs text-gray-500">Page 4 of 6</p>
                </footer>
            </main>
            
            {/* Page 5 */}
            <main className="p-8 sm:p-12 font-sans text-sm print:break-before-page">
                 <header className="flex justify-between items-start pb-4 border-b-2 border-red-600">
                    <div className="w-1/3">
                        <Logo />
                    </div>
                    <div className="text-right text-xs space-y-1">
                        <h2 className="font-bold text-base">Nature Enterprises</h2>
                        <p>A/p -Tung  , Sangli,</p>
                        <p>Sangli - Islampur Highway, 416401 .</p>
                        <p>Phone: 9595943332</p>
                        <p>Web: www.nature-enterprises.com</p>
                    </div>
                </header>

                <div className="my-4">
                    <h2 className="text-lg font-bold text-blue-800 tracking-wide">Pricing</h2>
                    <p className="mt-2">Below is the pricing schedule and Bill of material for the major components.</p>
                </div>
                
                <section className="mt-8">
                    <table className="w-full border-collapse text-left text-xs">
                        <thead className="bg-gray-100">
                           <tr>
                                <th className="p-2 border border-gray-300 font-semibold w-2/3">Item</th>
                                <th className="p-2 border border-gray-300 font-semibold w-1/3 text-right">Amount</th>
                           </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-gray-300"><td className="p-2 border-x border-gray-300">Design, supply, installation, commissioning and support of a {systemSize.toFixed(2)}kW Roof Top Solar System</td><td className="p-2 border-x border-gray-300 text-right">{formatCurrency(designInstallationCost)}</td></tr>
                            <tr className="border-b border-gray-300"><td className="p-2 border-x border-gray-300">Freight &amp; Insurances</td><td className="p-2 border-x border-gray-300 text-right">Free Issue</td></tr>
                            <tr className="border-b border-gray-300"><td className="p-2 border-x border-gray-300">PPA Processing &amp; Liaising with MSEB/MAHADISCOM</td><td className="p-2 border-x border-gray-300 text-right">Included</td></tr>
                            <tr className="border-b border-gray-300"><td className="p-2 border-x border-gray-300">GST 12%</td><td className="p-2 border-x border-gray-300 text-right">Included</td></tr>
                            <tr className="border-b-2 border-gray-400 bg-gray-100"><td className="p-2 border-x border-gray-300 font-bold">Amount Payable to Nature Enterprises</td><td className="p-2 border-x border-gray-300 text-right font-bold">{formatCurrency(amountPayable)}</td></tr>
                        </tbody>
                    </table>
                    <p className="text-xs mt-2">Note: CFA/Subsidy depends on eligibility criteria's as per Govt policy (National Portal) &amp; approval by agency post inspection; once approved CFA will be directly transfer to beneficiary's account post final payment of vendor.</p>
                </section>

                <section className="mt-8">
                     <h3 className="font-bold text-blue-800 mb-2 text-center text-base">Bill of Material</h3>
                     <p className="text-center text-xs mb-4">Bill of material for major components</p>
                     <table className="w-full border-collapse border border-gray-300 text-left text-xs">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-2 border border-gray-300 font-semibold w-1/4">Item</th>
                                <th className="p-2 border border-gray-300 font-semibold w-1/2">Make</th>
                                <th className="p-2 border border-gray-300 font-semibold w-1/4">Capacity</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-gray-300">
                                <td className="p-2 border-x border-gray-300 font-semibold">Solar Panels</td>
                                <td className="p-2 border-x border-gray-300">MNRE/ALMM Approved Mono DCR 440-575wp modules (Premier/UTL/FUJIYAMA/Rayzon/Renewsys/Axitec OR Equivalent)</td>
                                <td className="p-2 border-x border-gray-300">{systemSize.toFixed(2)}kW</td>
                            </tr>
                            <tr className="border-b border-gray-300">
                                <td className="p-2 border-x border-gray-300 font-semibold">Grid Tie Inverter</td>
                                <td className="p-2 border-x border-gray-300">Growatt/GoodWe/Sofar/UTL (or Equivalent) with Remote Monitoring System</td>
                                <td className="p-2 border-x border-gray-300">{inverterCapacity}</td>
                            </tr>
                             <tr className="border-b border-gray-300">
                                <td className="p-2 border-x border-gray-300 font-semibold">AC &amp; DC Junction Box</td>
                                <td className="p-2 border-x border-gray-300">ACDB &amp; DCDB as per MNRE Guidelines</td>
                                <td className="p-2 border-x border-gray-300">1 Lot</td>
                            </tr>
                             <tr className="border-b border-gray-300">
                                <td className="p-2 border-x border-gray-300 font-semibold">Circuit breakers</td>
                                <td className="p-2 border-x border-gray-300">ABB/Siemens/Phoenix Contact</td>
                                <td className="p-2 border-x border-gray-300">As required</td>
                            </tr>
                             <tr className="border-b border-gray-300">
                                <td className="p-2 border-x border-gray-300 font-semibold">Energy &amp; Net Meter</td>
                                <td className="p-2 border-x border-gray-300">DISCOM/MSEDCL Approved</td>
                                <td className="p-2 border-x border-gray-300">1 Lot</td>
                            </tr>
                             <tr className="border-b border-gray-300">
                                <td className="p-2 border-x border-gray-300 font-semibold">Structure</td>
                                <td className="p-2 border-x border-gray-300">Pre GI (Standard- Front leg 1 meter)</td>
                                <td className="p-2 border-x border-gray-300">1 Lot</td>
                            </tr>
                            <tr className="border-b border-gray-300">
                                <td className="p-2 border-x border-gray-300 font-semibold">Balance of System</td>
                                <td className="p-2 border-x border-gray-300">MNRE/MSEDCL approved AC&amp;DC Cables upto DB, Earthing Kit (3No.) with Lighting Arrestor</td>
                                <td className="p-2 border-x border-gray-300">As required</td>
                            </tr>
                            <tr>
                                <td className="p-2 border-x border-b border-gray-300 font-semibold">Location of Installation</td>
                                <td className="p-2 border-x border-b border-gray-300">{installationLocation}</td>
                                <td className="p-2 border-x border-b border-gray-300">1 Lot</td>
                            </tr>
                        </tbody>
                     </table>
                </section>
                
                <footer className="mt-12 pt-4 text-center relative">
                     <p className="font-bold text-blue-800">अनुभवी, नामांकित व अधिकृत व्हेंडर "Nature Enterprises" सोबत सौरवीज निर्मिती करा व प्रदूषण मुक्त व्हा!</p>
                    <p className="absolute right-0 bottom-0 text-xs text-gray-500">Page 5 of 6</p>
                </footer>
            </main>

            {/* Page 6 */}
            <main className="p-8 sm:p-12 font-sans text-sm print:break-before-page">
                 <header className="flex justify-between items-start pb-4 border-b-2 border-red-600">
                    <div className="w-1/3">
                        <Logo />
                    </div>
                    <div className="text-right text-xs space-y-1">
                        <h2 className="font-bold text-base">Nature Enterprises</h2>
                        <p>A/p -Tung  , Sangli,</p>
                        <p>Sangli - Islampur Highway, 416401 .</p>
                        <p>Phone: 9595943332</p>
                        <p>Web: www.nature-enterprises.com</p>
                    </div>
                </header>
                <div className="text-center my-4">
                    <h2 className="text-lg font-bold text-blue-800 tracking-wide border-b-2 border-red-600 inline-block pb-1">Terms and Conditions</h2>
                </div>
                <section className="mt-8">
                    <table className="w-full border-collapse border border-gray-300 text-left text-xs">
                        <tbody>
                            <tr className="border-b border-gray-300 align-top">
                                <td className="p-2 border-r border-gray-300 font-semibold w-1/5">Payment Terms</td>
                                <td className="p-2">
                                    <ul className="list-disc list-inside space-y-1">
                                        <li>₹5,000 advance for documentation and associated charges.</li>
                                        <li>70% of the order value against Proforma Invoice (PI) before dispatch of material.</li>
                                        <li>20% of the total order value upon completion of material installation.</li>
                                        <li>10% of the total order value before MSEB confirmation.</li>
                                    </ul>
                                </td>
                            </tr>
                            <tr className="border-b border-gray-300">
                                <td className="p-2 border-r border-gray-300 font-semibold">Delivery Period</td>
                                <td className="p-2">Within 15 days from the date of a confirmed Purchase Order and receipt of advance payment.</td>
                            </tr>
                            <tr className="border-b border-gray-300">
                                <td className="p-2 border-r border-gray-300 font-semibold">Duties / Taxes</td>
                                <td className="p-2">GST @ 12% is included in the quotation.</td>
                            </tr>
                            <tr className="border-b border-gray-300 align-top">
                                <td className="p-2 border-r border-gray-300 font-semibold">Subsidy</td>
                                <td className="p-2">
                                    <ul className="list-disc list-inside space-y-1">
                                        <li>Our responsibility is limited to providing the certificate/token from the government portal (PM Surya Ghar Yojana). The timeline and responsibility for the subsidy amount to be credited to your bank account rests with the government organizations.</li>
                                        <li>You can track your proposal status online on the government website.</li>
                                    </ul>
                                </td>
                            </tr>
                            <tr className="border-b border-gray-300 align-top">
                                <td className="p-2 border-r border-gray-300 font-semibold">Warranty</td>
                                <td className="p-2 space-y-2">
                                    <div>
                                        <p className="font-bold underline">Solar Module</p>
                                        <p>25 Years Limited Warranty for Generation (10 Years @ 90% Power Output and next 15 years @ 80% Power Output).</p>
                                    </div>
                                    <div>
                                        <p className="font-bold underline">Inverter/Controller</p>
                                        <p>5 - 10 Years Limited Warranty.</p>
                                    </div>
                                    <div>
                                        <p className="font-bold underline">Balance of System</p>
                                        <p>Net Meter, Generator Meter, ACDB/DCDB, and connectors have a 1-year warranty. Fabrication has a 1-year warranty.</p>
                                    </div>
                                    <div>
                                        <p className="font-bold">The warranty does not apply to defects resulting from:</p>
                                        <ol className="list-decimal list-inside pl-4">
                                            <li>Willful damage or negligence, normal wear and tear, or installation/maintenance by the purchaser or a third party without our prior written consent.</li>
                                            <li>Misuse or abuse of the equipment.</li>
                                            <li>Modifications or alterations made by the purchaser or a third party without our written consent.</li>
                                        </ol>
                                    </div>
                                </td>
                            </tr>
                             <tr className="border-b border-gray-300 align-top">
                                <td className="p-2 border-r border-gray-300 font-semibold">Customer Responsibility</td>
                                <td className="p-2">
                                    <ul className="list-disc list-inside space-y-1">
                                        <li>Provide access to the worksite for delivery and installation.</li>
                                        <li>Provide a suitable and secure space for storing equipment and materials.</li>
                                        <li>Provide free electricity and water for installation purposes.</li>
                                        <li>Any expenses related to load extension will be the customer's responsibility.</li>
                                        <li>Purchasing stamp paper for required agreements.</li>
                                        <li>Cost and installation of RCCB and MCB at the meter outlet. A fiber/acrylic box for the meter display is included.</li>
                                        <li>Approximately 90 days will be required for the MSEB release order and meter installation after system installation is complete.</li>
                                        <li>This quotation includes standard fabrication (front leg 1 meter). No ladder or walkway is included.</li>
                                    </ul>
                                </td>
                            </tr>
                            <tr className="align-top">
                                <td className="p-2 border-r border-gray-300 font-semibold">After-Sales Service</td>
                                <td className="p-2">
                                    <p>We provide 1 year of complimentary service assistance. After 1 year, you have two options:</p>
                                    <ol className="list-decimal list-inside pl-4 mt-1">
                                        <li>Contact the respective component manufacturers directly via their toll-free numbers. Any transport and service expenses will be your responsibility.</li>
                                        <li>Request a paid service quotation from us.</li>
                                    </ol>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </section>
                <footer className="mt-12 pt-4 text-center relative">
                    <p className="font-bold text-blue-800">सौर वीज निर्मिती करा व प्रदूषण मुक्त व्हा!</p>
                    <p className="absolute right-0 bottom-0 text-xs text-gray-500">Page 6 of 6</p>
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
                <div className="flex justify-between items-center p-6 print:hidden">
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-48" />
                </div>
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
