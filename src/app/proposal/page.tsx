
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

  // Page 5 Calculations
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
  
  // Page 6 Calculations
  const tableSystemCost = designInstallationCost + ppaProcessingCost;
  const gstAmount = tableSystemCost * (gstPercentage / 100);
  const amountPayable = tableSystemCost + gstAmount;
  const realCostToCustomer = amountPayable - incentives;

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
                    <p className="font-bold mt-4">Aniket R Patil</p>
                    <p>Director of Marketing</p>
                    <p>Mobile: 9595943332</p>
                    <p>Email: info@nature-enterprises.com</p>
                    <p>Website: www.nature-enterprises.com</p>
                </section>

                <footer className="mt-12 pt-4 border-t-2 border-blue-800 text-center relative">
                    <p className="font-bold text-blue-800">A MAHADISCOM, MNRE & MEDA Registered Partner!</p>
                    <p className="absolute right-0 bottom-0 text-xs text-gray-500">Page 1 of 8</p>
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
                    <p>नमस्कार सर/मॅडम,</p>
                    <p>सौरऊर्जेमध्ये गुंतवणूक करण्यात रस घेतल्याब‌द्दल धन्यवाद. आम्ही इंडो-ऑस्ट्रेलियन सौर ऊर्जा व्यवसाय आहोत. 2016 पासून आपल्या लोकल एरियामध्ये काम करत आहोत. आतापर्यंत आम्ही 500 हून अधिक ग्राहकांना त्यांचे वीज बिल कमी करण्यासाठी आणि पर्यावरण वाचवण्यासाठी सौरऊर्जा वापरण्यास मदत केली आहे. गरीब आणि मध्यमवर्गीय कुटुंबांचे जीवनमान सुधारण्यासाठी काम करण्यावर आमचा ठाम विश्वास आहे. त्यासाठी आम्ही बेरोजगार तरुणांसाठी स्थानिक रोजगार निर्माण करतो आणि परवडणारी आणि विश्वासार्ह सौरऊर्जा यंत्रणा सोयीस्करपणे उपलब्ध करून देतो.</p>
                    <p>एकत्रितपणे आपण ग्लोबल वॉर्मिंगमुळे होणारा हवामानातील बदल थांबवू शकतो. ही एक दीर्घकालीन गुंतवणूक आहे जी केवळ तुम्हालाच नाही तर सर्वाना शाश्वत ऊर्जा भविष्याच्या दिशेने वाटचाल करण्यास मदत करेल. तुमची स्वतः वीज निर्माण करणे ही ऊर्जा-स्वातंत्र्य मिळविण्यासाठी टाकलेले एक प्रमुख पाऊल आहे.</p>
                    <p>विजेची किंमत दरवर्षी वाढत असल्याने, अनेक व्यवसाय/घरे त्यांचे वीज बिल कमी करण्यासाठी दीर्घकालीन पर्याय शोधत आहेत. सौरऊर्जा हा एक उत्तम पर्याय आहे जो दीर्घकाळासाठी हजारो रुपयांची बचत करतो आणि ज्याचा पर्यावरणालाही फायदा होतो.</p>
                    <p>सौरऊर्जा उपकरणे डिझाइन करण्यासाठी आम्ही तुमच्या ऊर्जेच्या गरजा, साइटचे तपशील, साइटवरील सूर्यप्रकाश यांचा तपशीलवार अभ्यास केला आहे. या प्रस्तावात, आम्ही सौर यंत्रणेचा तुमच्या एकूण वीज खर्चावर होणारा अपेक्षित परिणाम समाविष्ट केला आहे. तुमचा सध्याचा आणि अंदाजित वीज वापर आणि त्यापलीकडे तुमची बचत काय असेल, या प्रणालीचा परतावा कालावधी दर्शविणारी माहिती देखील दिलेली आहे.</p>
                    <p>आमच्या प्रस्तावाचा तुम्ही विचार करावा अशी आम्ही विनंती करतो आणि तुमच्यासोबत दीर्घकालीन व्यावसायिक संबंध निर्माण करण्याची आशा करतो. आपल्याला काही प्रश्न असल्यास, कृपया आमच्याशी संपर्क साधण्यास अजिबात संकोच करू नका.</p>
                </section>

                <section className="mt-8">
                    <p>धन्यवाद,</p>
                    <p className="font-bold mt-4">Aniket R Patil</p>
                    <p>मार्केटिंग डायरेक्टर</p>
                </section>

                <footer className="mt-12 pt-4 border-t-2 border-blue-800 text-center relative">
                    <p className="font-bold text-blue-800">अनुभवी, नामांकित व अधिकृत व्हेंडर "Nature Enterprises" सोबत सौरवीज निर्मिती करा व प्रदूषण मुक्त व्हा!</p>
                    <p className="absolute right-0 bottom-0 text-xs text-gray-500">Page 2 of 8</p>
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

                <div className="text-center my-4">
                    <h2 className="text-lg font-bold text-blue-800 tracking-wide border-b-2 border-red-600 inline-block pb-1">Project Feasibility Report (DPR)</h2>
                </div>

                <section className="mt-8">
                    <h3 className="font-bold text-blue-800 mb-2">Customer Details</h3>
                    <table className="w-full border-collapse border border-gray-300 text-left">
                        <tbody>
                            <tr className="border-b border-gray-300">
                                <td className="p-2 border-r border-gray-300 font-semibold w-1/3">Customer Name ग्राहकाचे नाव:</td>
                                <td className="p-2">{name}</td>
                            </tr>
                            <tr className="border-b border-gray-300">
                                <td className="p-2 border-r border-gray-300 font-semibold">Consumer Number ग्राहक क्रमांक:</td>
                                <td className="p-2">{consumerNumber}</td>
                            </tr>
                            <tr className="border-b border-gray-300">
                                <td className="p-2 border-r border-gray-300 font-semibold">Sanctioned Load:</td>
                                <td className="p-2">{load.toFixed(2)}KW</td>
                            </tr>
                             <tr className="border-b border-gray-300">
                                <td className="p-2 border-r border-gray-300 font-semibold">Connection Type:</td>
                                <td className="p-2">{connectionType}</td>
                            </tr>
                             <tr className="border-b border-gray-300">
                                <td className="p-2 border-r border-gray-300 font-semibold">Consumer Category:</td>
                                <td className="p-2">{customerType}</td>
                            </tr>
                             <tr>
                                <td className="p-2 border-r border-gray-300 font-semibold">Avg. Monthly Bill:</td>
                                <td className="p-2">{formatCurrency(monthlyBill)}</td>
                            </tr>
                        </tbody>
                    </table>
                </section>
                
                <section className="mt-8">
                    <h3 className="font-bold text-blue-800 mb-2">Report Summary</h3>
                    <div className="space-y-4 text-gray-800 leading-relaxed text-justify">
                        <p>A basic study was carried out to understand energy requirements of {name}, {address}. The available solar irradiation at the site and using our proprietary tools we have calculated suitable solar options that can be installed on the site based on the available roof space for renewable energy installation.</p>
                        <p>Considering solar irradiation data at site and average electricity consumption required the customer has been recommended to <span className="font-bold">install a {systemSize.toFixed(2)}kW solar system.</span> This system will meet current demand while delivering <span className="font-bold">1140% ROI</span> (simple Return on investment) and <span className="font-bold">2.2 years to payback</span> at <span className="font-bold">57% IRR</span> (Internal rate of return). We believe this system will <span className="font-bold">save you over ₹34,20,649 over 25 years.</span> Please note typical life of solar panels is about 40 years. Please note average consumption is much lower than the designed capacity. Therefore, the actual returns will be higher than the above numbers.</p>
                        <p>The investment for solar equipment will be <span className="font-bold">{formatCurrency(designInstallationCost)}.</span> Considering annual electricity saving of <span className="font-bold">{formatCurrency(firstYearSavings)}</span> and accelerated depreciation/subsidy of <span className="font-bold">{formatCurrency(incentives)},</span> the net investment during the first year will be <span className="font-bold">{formatCurrency(netInvestment)}.</span></p>
                        <p>Current average monthly bill is {formatCurrency(monthlyBill)} and average monthly energy bill with solar will be <span className="font-bold">₹0.00</span> (Note: Only Energy charges considered. Customer may still have to pay fixed charges of Utility Company and excess energy usage beyond design capacity of solar system)</p>
                        <p>We recommend using net metering in this project as the client has most use during summer months. This will save cost associated with the batteries and increase return on the investment.</p>
                        <p>{name}, {address} यांचा वीज वापर समजून घेण्यासाठी बेसिक स्टडी करण्यात आला. त्यांची वीजेची गरज, जागेवर मिळणारी सौर ऊर्जा व उपलब्ध जागा या माहितीवरून आमचे प्रोप्रायटरी टूल्स वापरून आम्ही त्यांना लागणाऱ्या योग्य सौर ऊर्जा उपकरणाची शिफारस करत आहोत. या कपॅसिटीचे उपकरण व आमची मूल्यवर्धित सेवा आपल्याला आपल्या गुंतवणुकीवर जास्तीत जास्त परतावा मिळवुन देईल.</p>
                        <p>जागेवर मिळणारी सौर उर्जा व सरासरी वीज वापर याचा विचार करून आपल्याला {systemSize.toFixed(2)}kW कपॅसिटीचे सौर विजनिर्माण उपकरण बसवण्याची शिफारस करत आहोत. या कपॅसिटीचे उपकरण आम्ही दिलेल्या किंमतीत घेतल्यास ते तुमची सध्याची तुमची सध्याची वीज गरज भागून गुंतवणुकीवर 1140% ROI (simple Return on Investment) इतका परतावा मिळेल व गुंतवलेली रक्कम 2.2 वर्षांत वसूल होईल. आम्हाला विश्वास आहे की वरती शिफारस केलेले उपकरण आपल्याला नंतरच्या 25 वर्षात ₹34,20,649 ची बचत करून देईल. सौर ऊर्जा उपकरणे 40 वर्षे टिकतात.</p>
                    </div>
                </section>
                
                <footer className="mt-12 pt-4 text-center relative">
                    <p className="font-bold text-blue-800">सौर वीज निर्मिती करा व प्रदूषण मुक्त व्हा!</p>
                    <p className="absolute right-0 bottom-0 text-xs text-gray-500">Page 3 of 8</p>
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
                    <p className="mt-2">In the table below, you can find basic pricing for our recommended solar solution. Please note these numbers are based on the 25 years of life.</p>
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
                            <tr className="border-b border-gray-300"><td className="p-2 border-r border-gray-300 font-semibold">Expected monthly output range</td><td className="p-2 border-r border-gray-300 font-semibold">विजनिर्माण</td><td className="p-2">{formatUnits(expectedMonthlyOutputMin)} to {formatUnits(expectedMonthlyOutputMax)}</td></tr>
                            <tr className="border-b border-gray-300"><td className="p-2 border-r border-gray-300 font-semibold">Lifetime value of electricity generated</td><td className="p-2 border-r border-gray-300 font-semibold">होणारी वीज बचत</td><td className="p-2">{formatCurrency(lifetimeValue)} ({SYSTEM_LIFETIME_YEARS} years)</td></tr>
                            <tr className="border-b border-gray-300"><td className="p-2 border-r border-gray-300 font-semibold">Installed system cost</td><td className="p-2 border-r border-gray-300 font-semibold">सिस्टिमचा खर्च</td><td className="p-2">{formatCurrency(designInstallationCost)}</td></tr>
                            <tr className="border-b border-gray-300"><td className="p-2 border-r border-gray-300 font-semibold">First year value of electricity generated</td><td className="p-2 border-r border-gray-300 font-semibold">पहिल्या वर्षीची वीज बचत</td><td className="p-2">{formatCurrency(firstYearSavings)}</td></tr>
                            <tr className="border-b border-gray-300"><td className="p-2 border-r border-gray-300 font-semibold">Rebate/Subsidy</td><td className="p-2 border-r border-gray-300 font-semibold">सरकारी सवलत</td><td className="p-2">{formatCurrency(incentives)}</td></tr>
                            <tr className="border-b border-gray-300"><td className="p-2 border-r border-gray-300 font-semibold">Net investment</td><td className="p-2 border-r border-gray-300 font-semibold">पहिल्या वर्षात नेट गुंतवणूक</td><td className="p-2">{formatCurrency(netInvestment)}</td></tr>
                            <tr className="border-b border-gray-300"><td className="p-2 border-r border-gray-300 font-semibold">Cost/unit without Solar</td><td className="p-2 border-r border-gray-300 font-semibold">सध्याचा पर युनिट खर्च</td><td className="p-2">₹ {COST_PER_UNIT.toFixed(2)}</td></tr>
                            <tr className="border-b border-gray-300"><td className="p-2 border-r border-gray-300 font-semibold">Cost/unit with Solar</td><td className="p-2 border-r border-gray-300 font-semibold">नवीन पर युनिट खर्च</td><td className="p-2">₹ {costPerUnitWithSolar.toFixed(2)}</td></tr>
                            <tr><td className="p-2 border-r border-gray-300 font-semibold">Rebate/Subsidy</td><td className="p-2 border-r border-gray-300 font-semibold">सरकारी सवलत</td><td className="p-2">Subsidy</td></tr>
                        </tbody>
                    </table>
                </section>

                <footer className="mt-12 pt-4 text-center relative">
                    <p className="absolute right-0 bottom-0 text-xs text-gray-500">Page 4 of 8</p>
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
                            <tr className="border-b border-gray-300"><td className="p-2 border-x border-gray-300">Freight & Insurances</td><td className="p-2 border-x border-gray-300 text-right">Free Issue</td></tr>
                            <tr className="border-b border-gray-300"><td className="p-2 border-x border-gray-300">PPA Processing & Liaising with MSEB/MAHADISCOM</td><td className="p-2 border-x border-gray-300 text-right">{formatCurrency(ppaProcessingCost)}</td></tr>
                            <tr className="border-b-2 border-gray-400"><td className="p-2 border-x border-gray-300 font-semibold">System Cost</td><td className="p-2 border-x border-gray-300 text-right font-semibold">{formatCurrency(tableSystemCost)}</td></tr>
                            <tr className="border-b border-gray-300"><td className="p-2 border-x border-gray-300">GST @ {gstPercentage}% (70:30 ratio for Goods & Services)</td><td className="p-2 border-x border-gray-300 text-right">{formatCurrency(gstAmount)}</td></tr>
                            <tr className="border-b-2 border-gray-400 bg-gray-100"><td className="p-2 border-x border-gray-300 font-bold">Amount Payable to Nature Enterprises</td><td className="p-2 border-x border-gray-300 text-right font-bold">{formatCurrency(amountPayable)}</td></tr>
                            <tr className="border-b border-gray-300"><td className="p-2 border-x border-gray-300">Rebate/Subsidy from Government</td><td className="p-2 border-x border-gray-300 text-right">{formatCurrency(incentives)}</td></tr>
                            <tr className="border-b-2 border-gray-400 bg-gray-100"><td className="p-2 border-x border-gray-300 font-bold">Real Cost to the Customer</td><td className="p-2 border-x border-gray-300 text-right font-bold">{formatCurrency(realCostToCustomer)}</td></tr>
                        </tbody>
                    </table>
                    <p className="text-xs mt-2">Note: CFA/Subsidy depends on eligibility criteria's as per Govt policy (National Portal) & approval by agency post inspection; once approved CFA will be directly transfer to beneficiary's account post final payment of vendor.</p>
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
                                <td className="p-2 border-x border-gray-300">MNRE/ALMM Approved Mono DCR 440-545wp modules (Waaree/Vikram/Goldi/Rayzon/Renewsys/Axitec OR Equivalent)</td>
                                <td className="p-2 border-x border-gray-300">{systemSize.toFixed(2)}kW</td>
                            </tr>
                            <tr className="border-b border-gray-300">
                                <td className="p-2 border-x border-gray-300 font-semibold">Grid Tie Inverter</td>
                                <td className="p-2 border-x border-gray-300">Growatt/GoodWe/Sofar/Evvo (or Equivalent) with Remote Monitoring System</td>
                                <td className="p-2 border-x border-gray-300">{inverterCapacity}</td>
                            </tr>
                             <tr className="border-b border-gray-300">
                                <td className="p-2 border-x border-gray-300 font-semibold">AC & DC Junction Box</td>
                                <td className="p-2 border-x border-gray-300">ACDB & DCDB as per MNRE Guidelines</td>
                                <td className="p-2 border-x border-gray-300">1 Lot</td>
                            </tr>
                             <tr className="border-b border-gray-300">
                                <td className="p-2 border-x border-gray-300 font-semibold">Circuit breakers</td>
                                <td className="p-2 border-x border-gray-300">ABB/Siemens/Phoenix Contact</td>
                                <td className="p-2 border-x border-gray-300">As required</td>
                            </tr>
                             <tr className="border-b border-gray-300">
                                <td className="p-2 border-x border-gray-300 font-semibold">Energy & Net Meter</td>
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
                                <td className="p-2 border-x border-gray-300">MNRE/MSEDCL approved AC&DC Cables upto DB, Earthing Kit (3No.) with Lighting Arrestor</td>
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

                 <section className="mt-8">
                     <h3 className="font-bold text-blue-800 mb-2 text-center text-base">Customer Responsibilities</h3>
                     <table className="w-full border-collapse border border-gray-300 text-left text-xs">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-2 border border-gray-300 font-semibold w-[5%]">Sr. No</th>
                                <th className="p-2 border border-gray-300 font-semibold">Item</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-gray-300">
                                <td className="p-2 border-x border-gray-300 text-center">1.</td>
                                <td className="p-2 border-x border-gray-300">Provision of shade free roof/other areas for installation of the solar equipment, any additional infrastructure and civil work will be in scope of customer (If required)</td>
                            </tr>
                            <tr className="border-b border-gray-300">
                                <td className="p-2 border-x border-gray-300 text-center">2.</td>
                                <td className="p-2 border-x border-gray-300">Load Extension & enhancement of existing supply/switchgears like ICTD/ICDO & RCCB/ELCB at metering board/cabinet/room (if required)</td>
                            </tr>
                            <tr>
                                <td className="p-2 border-x border-b border-gray-300 text-center">3.</td>
                                <td className="p-2 border-x border-b border-gray-300">Purchasing Stamp, Making & signing Power Purchase Agreement (PPA) with local utility & Other relevant agreements & documents as per guidelines by DISCOM & MNRE National Portal</td>
                            </tr>
                        </tbody>
                     </table>
                </section>
                

                <footer className="mt-12 pt-4 text-center relative">
                     <p className="font-bold text-blue-800">अनुभवी, नामांकित व अधिकृत व्हेंडर "Nature Enterprises" सोबत सौरवीज निर्मिती करा व प्रदूषण मुक्त व्हा!</p>
                    <p className="absolute right-0 bottom-0 text-xs text-gray-500">Page 5 of 8</p>
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
                                    <ul className="list-disc list-inside">
                                        <li>10% of order value as advance with the Purchase Order and</li>
                                        <li>80% of order value against delivery of Material/System. (Pro rata basis)</li>
                                        <li>10% of total order value before successful commissioning of the Power plant.</li>
                                        <li>Delayed payments shall carry interest rate of 1.5% per day of Balance Amount.</li>
                                    </ul>
                                </td>
                            </tr>
                            <tr className="border-b border-gray-300">
                                <td className="p-2 border-r border-gray-300 font-semibold">Validity</td>
                                <td className="p-2">7 days from date of submission</td>
                            </tr>
                            <tr className="border-b border-gray-300 align-top">
                                <td className="p-2 border-r border-gray-300 font-semibold">System cost</td>
                                <td className="p-2">Price given above includes cost of parts, installation, and commissioning. Installation costs are approximate. This is a standard proposal which may change as per site's conditions after conducting site survey.</td>
                            </tr>
                            <tr className="border-b border-gray-300 align-top">
                                <td className="p-2 border-r border-gray-300 font-semibold">Subsidy</td>
                                <td className="p-2">The CFA/subsidy will be available only for residential applications registered till 31.03.2025 in the National Portal and will be released by Central Govt after clearance by inspecting authority (DISCOM) on successful commissioning and installation of metering system as per specified procedure. The CFA is not be applicable with retrospective effect. Subsidy will be released by the Government based on their schedule that is outside our control. Therefore, Affordable Energy shall not be responsible for the subsidy payment. Our scope is limited only to apply & submit documents required for the subsidy claim as per Government rule on National Portal.</td>
                            </tr>
                            <tr className="border-b border-gray-300 align-top">
                                <td className="p-2 border-r border-gray-300 font-semibold">Taxes & Duties</td>
                                <td className="p-2">
                                    <ul className="list-disc list-inside">
                                        <li>All applicable GST will be charged as extra on actuals.</li>
                                        <li>Statutory approvals from local authorities/state electricity distribution company (if require) etc.</li>
                                    </ul>
                                </td>
                            </tr>
                            <tr className="border-b border-gray-300 align-top">
                                <td className="p-2 border-r border-gray-300 font-semibold">Warranty</td>
                                <td className="p-2 space-y-2">
                                    <div>
                                        <p className="font-bold underline">Solar Module</p>
                                        <p>25 Years Limited Warranty for Generation (10 Years 90% Power Output and next 15 years on 80% power Output) | 10 Years Limited Warranty on Product and Workmanship</p>
                                    </div>
                                    <div>
                                        <p className="font-bold underline">Inverter/Controller</p>
                                        <p>5 - 8 Years Limited Warranty</p>
                                    </div>
                                    <div>
                                        <p className="font-bold underline">Balance of the System</p>
                                        <p>The defect liability period shall be for 12 months commencing from date of actual commissioning (including deemed commissioning). During this period, we shall attend to issues free of cost, related to the Solar Photovoltaic system on receiving notification of such defect from the customer.</p>
                                        <p>Parts and Components, which are repaired or replaced during such period, are warranted for the original warranty period only and shall not carry any extended warranty. If the equipment is not repairable at site, the same has to be sent at our workshop on freight prepaid basis after obtaining our consent in writing and we shall make good the defect and return back to you on freight to pay basis.</p>
                                        <p>The warranty shall not apply to defects resulting from:</p>
                                        <ol className="list-decimal list-inside pl-4">
                                            <li>Wilful damage or negligence, normal wear and tear, Installation and/or maintenance by Purchaser or a third party without supplier's prior written consent.</li>
                                            <li>Misuse or abuse of Equipment.</li>
                                            <li>Modifications or alterations made by Purchaser or a third party without supplier's written consent.</li>
                                        </ol>
                                    </div>
                                </td>
                            </tr>
                             <tr className="border-b border-gray-300 align-top">
                                <td className="p-2 border-r border-gray-300 font-semibold">After Sales Services</td>
                                <td className="p-2">
                                    <ol className="list-decimal list-inside">
                                        <li>We can provide AMC services at additional cost.</li>
                                        <li>On-site Service calls will be charged on per day basis plus material charges.</li>
                                    </ol>
                                </td>
                            </tr>
                             <tr className="border-b border-gray-300 align-top">
                                <td className="p-2 border-r border-gray-300 font-semibold">Delivery / Completion Period</td>
                                <td className="p-2 space-y-2">
                                    <p>Within 8 to 10 weeks from the date of your technically and commercially clear Purchase Order along with advance.</p>
                                    <p>The Delivery/Completion shall be reasonably extended if:</p>
                                    <ul className="list-disc list-inside pl-4">
                                        <li>The technical or commercial data required by us to execute the order including advance payment are not made available in time or if subsequent changes, which delay the delivery, are made by the purchaser.</li>
                                        <li>If the purchaser is behind the schedule with the work, he has to carry out to is late in fulfilling the contractual obligations.</li>
                                    </ul>
                                    <p>We shall retain the right on equipment, materials or parts supplied by us under this quotation until full value thereof as per our invoice has been fully paid to us as per terms and conditions.</p>
                                </td>
                            </tr>
                              <tr className="border-b border-gray-300 align-top">
                                <td className="p-2 border-r border-gray-300 font-semibold">Commissioning & Testing</td>
                                <td className="p-2 space-y-2">
                                    <p>If the grid is not made available by the customer to us within 15 days of the solar power plant being ready for grid connectivity because of which we cannot conduct the final performance tests, it shall be construed as "Deemed Commissioning" and final payment shall be made by the customer subsequent to such deemed commissioning.</p>
                                    <p>Once the solar power plant is ready for connection to the Grid and we have conducted the test after such connection successfully whether in presence of the customer or not, the solar power plant shall be considered as commissioned and tested. Confirmation of such commissioning & testing should be accepted by the customer in writing and shall not be unreasonably withheld for no fault on our end.</p>
                                </td>
                            </tr>
                            <tr className="align-top">
                                <td className="p-2 border-r border-gray-300 font-semibold">Limitation fo liability & Indemnity</td>
                                <td className="p-2 space-y-2">
                                    <p>In no event, we shall be liable for any special, punitive, indirect, or consequential damages of any nature whatsoever, nor for any losses or damages caused by reason of unavailability of the Equipment or the Facility, shutdowns or service interruptions, loss of use, loss of actual or potential profits or revenue, loss of reputation, inventory or use charges, interest charges or cost of capital or any claims made by the customer or other contracting parties or pollution remediation costs. The overall liability by us whether for liquidated damages or otherwise shall not be more than 5 % of the total order value.</p>
                                    <p>Each Party shall indemnify and hold the other Party harmless from any claims by a third party for loss of or damage to property or death or personal injury arising out of or connected with that Party's negligence while engaged in its activities under the Contract. In the event, such damage or injury is caused by the joint or concurrent negligence of the Supplier/Contractor and the customer, the loss shall be borne by each Party in proportion to its negligence.</p>
                                    <p>The Liquidated Damages shall be the customer's only remedy for delay in delivery and for any deviations in the supply of equipment and shall constitute the customer's only liability in these respects.</p>
                                    <p>We strongly recommend having solar system insured after the installation as we will not be liable for the accidental damages.</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </section>
                <footer className="mt-12 pt-4 text-center relative">
                    <p className="font-bold text-blue-800">सौर वीज निर्मिती करा व प्रदूषण मुक्त व्हा!</p>
                    <p className="absolute right-0 bottom-0 text-xs text-gray-500">Page 6 of 8</p>
                </footer>
            </main>

            {/* Page 7 */}
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
                    <h2 className="text-lg font-bold text-red-600 tracking-wide">Benefits of going solar with us</h2>
                </div>
                <section className="mt-8 space-y-4 text-gray-800 leading-relaxed text-justify text-sm">
                    <p><span className="font-bold">1. Experienced company working since 2016 in Solar Industry</span> - We believe in Integrity, Respect & Win-Win business practices. We have served 500+ happy customers till date with our best-in-class solar systems and reliable after sales services. We are Affordable at the same time Convenient & Reliable.</p>
                    <p><span className="font-bold">2. We will save you money</span> - While there are up-front costs, our customised design ensures utilisation of the last ray of sunlight to minimise your energy bills. With combined over 40 years of experience, our design and finance teams evaluate multiple designs to explore and identify right design that will deliver best return on investment for our customers. In most cases, you will recover your investment in less than three years.</p>
                    <p><span className="font-bold">3. We make it convenient for you</span> - Our unique business model ensures hassle free delivery and operation of the solar systems supplied by us. There is good chance of having our friendly distributor or installer right near you to ensure timely support. Many times, you don't have to call support number but walk/drive to our representative near you.</p>
                    <p><span className="font-bold">4. Our people and equipment is highly reliable</span> - We use best quality material around the world to build solar systems for our customers. This is supported with the world class customer service from our employees. This will ensure smooth project delivery and reliable operation of the equipment the equipment supplied by us.</p>
                    <p><span className="font-bold">5. Our local support will give you peace of mind</span> - In most cases there will be a local support person near you whom you can talk to face-to-face about the support you need. There is no need to talk to the machines to get the support.</p>
                    <p><span className="font-bold">6. Talk to our customers before you decide</span> - We highly recommend you talking to our customers and physically having a look at our projects. Our customers will tell you about the quality of our services while our equipment quality will talk for itself.</p>
                    <p><span className="font-bold">7. We help you to get finance for your solar solutions</span> - Our strong relationships with local MFIs and nationalised banks will help you in getting the loan for your solar system. With nationalised banks, you can avail loans at subsidised rates.</p>
                    <p><span className="font-bold">8. Not enough capital! No issue</span> - We can offer our solar solutions on instalments to ensure your daily life spending is not disturbed. Talk to us if you need more information. Our modularised design gets you started with very small investment that you can expand as you go.</p>
                    <p><span className="font-bold">9. Insure your system and be worry free</span> - Our obligation free insurance will provide you peace of mind in case of damage to your solar system. Talk to us if you need to protect your system.</p>
                </section>
                <footer className="mt-12 pt-4 border-t-2 border-gray-400 text-center relative">
                    <p className="font-bold text-blue-800">अनुभवी, नामांकित व अधिकृत व्हेंडर "Nature Enterprises" सोबत सौरवीज निर्मिती करा व प्रदूषण मुक्त व्हा!</p>
                    <p className="absolute right-0 bottom-0 text-xs text-gray-500">Page 7 of 8</p>
                </footer>
            </main>

            {/* Page 8 */}
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
                <div className="text-center my-8">
                    <h2 className="text-lg font-bold text-orange-600 tracking-wide">Our Process</h2>
                </div>
                
                <section className="flex justify-center my-16">
                    <div className="grid grid-cols-3 grid-rows-3 gap-x-8 gap-y-12 w-full max-w-2xl items-center text-gray-700">
                        <div className="text-center font-bold uppercase">CONSULT<br/>WITH YOU</div>
                        <div className="text-center font-bold uppercase">DEVELOP<br/>SOLUTION</div>
                        <div className="text-center font-bold uppercase">MAKE<br/>RECOMMENDATIONS</div>
                        
                        <div className="text-center font-bold uppercase">REMOTE<br/>MONITORING</div>
                        <div className="flex justify-center items-center p-4 bg-gray-100 rounded-full border-4 border-gray-300 shadow-md">
                             <Logo showText={false} />
                        </div>
                        <div className="text-center font-bold uppercase">DESIGN, FABRICATE<br/>& INSTALL</div>
                        
                        <div className="text-center font-bold uppercase">ON-GOING<br/>MAINTENANCE</div>
                        <div className="text-center font-bold uppercase">ON-SITE<br/>MANAGEMENT</div>
                        <div className="text-center font-bold uppercase">TEST, COMMISSION<br/>& TRAINING</div>
                    </div>
                </section>

                <section className="mt-24 text-xs text-red-600 text-justify space-y-1">
                    <p>Please note this document contains confidential and/or privileged information for the sole use of the intended recipient(s). All electronically supplied data must be checked against an applicable hardcopy version which shall be the only document which Nature Enterprises warrants accuracy. If you are not the intended recipient, any use, distribution or copying of the information contained in this document is strictly prohibited. If you have received this document in error, please return the sender, immediately delete and destroy any copies of this document. The information provided in this document is solely based on the data provided by the recipient at this point of time. All values are determined mathematically based on standardised conditions. The actual operating results will be dictated significantly by the actual irradiation conditions, the actual efficiency, operating conditions and individual consumption behaviour and can deviate from the calculated results.</p>
                </section>

                <footer className="mt-12 pt-4 border-t-2 border-gray-400 text-center relative">
                    <p className="font-bold text-blue-800">सौर वीज निर्मिती करा व प्रदूषण मुक्त व्हा!</p>
                    <p className="absolute right-0 bottom-0 text-xs text-gray-500">Page 8 of 8</p>
                </footer>
            </main>

            {/* Page 9 */}
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
                    <h2 className="text-lg font-bold text-blue-800 tracking-wide border-b-2 border-red-600 inline-block pb-1">Purchase order/Letter of Intent (LOI)</h2>
                </div>

                <section className="mt-8 space-y-4 text-gray-800 leading-relaxed">
                   <div>
                        <p>To</p>
                        <p className="font-bold">Nature Enterprises</p>
                        <p>A/P Tung, Dist Sangli, Sangli - Islampur Highway, Tung. 416401</p>
                   </div>
                   <div className="mt-6">
                        <p><span className="font-bold">Subject:</span> <span className="underline">Purchase Order for the design, supply, install & commission the Solar power system</span></p>
                   </div>

                   <p className="mt-6">This has reference to proposing design, supply, install & commission the Solar power system as per the quotation submitted by you and agreed by us. We are pleased to issue this Purchase Order as an acceptance of the terms proposed by you with the quotation.</p>

                   <ol className="list-decimal list-inside space-y-2 mt-4">
                        <li>Plant capacity shall be {systemSize.toFixed(2)}KW.</li>
                        <li>Price {formatCurrency(amountPayable)}</li>
                        <li>You will design, supply, install and commission proposed Solar power system as per MNRE specifications.</li>
                        <li>Terms and Conditions will be as attached with the quotation and are available on <a href="http://www.nature-enterprises.com" className="text-blue-600 underline">www.nature-enterprises.com</a></li>
                        <li>
                            Our area of work (customer scope)
                            <ul className="list-[lower-alpha] list-inside pl-6 mt-2 space-y-1">
                                <li>We shall provide the shade free roof/other areas for the installation of the solar equipment; any additional infrastructure and civil work will be in our scope (If required).</li>
                                <li>We shall extend our Sanctioned Load if required to be same or above the proposed Solar System Capacity & enhancement of existing supply/switchgears like ICTP/ICDP & RCCB/ELCB at metering panel/board/room (if required)</li>
                                <li>Power Purchase Agreement (PPA) with local utility: Purchasing Stamp, Making & signing Power Purchase Agreement (PPA) with local utility & Other relevant agreements & documents as per guidelines by DISCOM, vendor shall facilitate the process if any support/guidance required.</li>
                            </ul>
                        </li>
                   </ol>

                    <p className="mt-6">Please proceed with the design, supply, and installation of the proposed solar power system.</p>
                    <p>Warm Regards,</p>

                    <div className="mt-20 space-y-2">
                        <p><span className="font-bold">Name:</span> {name}</p>
                        <p><span className="font-bold">Address:</span> {address}</p>
                        <p className="mt-4"><span className="font-bold">Date:</span></p>
                        <p className="mt-12"><span className="font-bold">Signature:</span></p>
                    </div>

                </section>

                <footer className="mt-12 pt-4 text-center relative" style={{top: '5vh'}}>
                    <p className="absolute right-0 bottom-0 text-xs text-gray-500">Page 9 of 9</p>
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
