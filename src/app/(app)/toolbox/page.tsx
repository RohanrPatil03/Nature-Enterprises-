"use client"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, FileText, Calculator } from "lucide-react"
import Link from "next/link"

const tools = {
  analysis: [
    { title: "Proposal Generator", description: "Create a professional proposal for your customers.", icon: FileText, href: "/toolbox/proposal-generator" },
    { title: "Solar ROI Calculator", description: "Estimate the return on investment for a solar installation.", icon: Calculator, href: "/toolbox/solar-roi-calculator" },
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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {tools.analysis.map(tool => <ToolCard key={tool.title} {...tool} />)}
    </div>
  )
}
