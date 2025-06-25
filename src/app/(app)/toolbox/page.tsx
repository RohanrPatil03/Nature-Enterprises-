"use client"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, Calculator, MapPin, SunDim, FileText } from "lucide-react"
import Link from "next/link"

const tools = {
  design: [
    { title: "PV System Sizer", description: "Calculate the optimal number of panels and inverter size for your needs.", icon: Calculator, href: "#" },
    { title: "Shade Analysis Tool", description: "Estimate energy loss due to shading from nearby objects.", icon: SunDim, href: "#" },
    { title: "Panel Layout Designer", description: "Visually arrange panels on a roof for maximum efficiency.", icon: MapPin, href: "#" },
  ],
  analysis: [
    { title: "Solar ROI Calculator", description: "Estimate your return on investment and payback period.", icon: Calculator, href: "#" },
    { title: "Energy Production Estimator", description: "Forecast monthly and annual energy output based on your location.", icon: SunDim, href: "#" },
    { title: "Incentive Finder", description: "Discover local and federal rebates and tax credits available to you.", icon: MapPin, href: "#" },
    { title: "Proposal Generator", description: "Create a professional proposal for your customers.", icon: FileText, href: "/toolbox/proposal-generator" },
  ],
}

type ToolCardProps = {
  title: string;
  description: string;
  icon: React.ElementType;
  href?: string;
};

function ToolCard({ title, description, icon: Icon, href = "#" }: ToolCardProps) {
    return (
        <Card className="flex flex-col">
            <CardHeader className="flex-grow">
                <div className="mb-4 bg-secondary p-3 rounded-lg w-fit">
                    <Icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="font-headline text-lg">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardFooter>
                <Button asChild>
                    <Link href={href}>Launch Tool <ArrowUpRight className="ml-2 h-4 w-4" /></Link>
                </Button>
            </CardFooter>
        </Card>
    );
}

export default function ToolboxPage() {
  return (
    <Tabs defaultValue="analysis" className="w-full">
      <div className="flex items-center justify-between mb-4">
        <TabsList>
          <TabsTrigger value="design">Design & Sizing</TabsTrigger>
          <TabsTrigger value="analysis">Financial Analysis</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="design">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tools.design.map(tool => <ToolCard key={tool.title} {...tool} />)}
        </div>
      </TabsContent>
      <TabsContent value="analysis">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tools.analysis.map(tool => <ToolCard key={tool.title} {...tool} />)}
        </div>
      </TabsContent>
    </Tabs>
  )
}
