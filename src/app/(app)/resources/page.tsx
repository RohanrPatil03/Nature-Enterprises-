
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
import { Globe, ArrowUpRight } from "lucide-react"

const resources = {
  gov: [
    { title: "SEIA", description: "The Solar Energy Industries Association (SEIA) is the national trade association for the U.S. solar industry.", href: "https://www.seia.org/" },
    { title: "NREL", description: "The National Renewable Energy Laboratory (NREL) is the nation's primary laboratory for renewable energy and energy efficiency research.", href: "https://www.nrel.gov/" },
    { title: "DSIRE", description: "Database of State Incentives for Renewables & Efficiency (DSIRE) is the most comprehensive source of information on incentives and policies.", href: "https://www.dsireusa.org/" },
  ],
  news: [
    { title: "Solar Power World", description: "Solar Power World is the leading online and print resource for news and information about solar installation, development and technology.", href: "https://www.solarpowerworldonline.com/" },
    { title: "Greentech Media", description: "Greentech Media (GTM) delivers news, research, and events on the clean energy market.", href: "https://www.greentechmedia.com/" },
    { title: "PV Magazine", description: "PV Magazine is a monthly trade publication for the international solar photovoltaics (PV) industry.", href: "https://www.pv-magazine.com/" },
  ],
  educational: [
    { title: "Solar Energy International (SEI)", description: "SEI provides industry-leading technical training and expertise in renewable energy.", href: "https://www.solarenergy.org/" },
    { title: "The Solar Foundation", description: "A nonprofit, nonpartisan organization dedicated to advancing solar energy use worldwide.", href: "https://www.thesolarfoundation.org/" },
    { title: "HeatSpring", description: "Online courses for solar professionals, from NABCEP certification to advanced design.", href: "https://www.heatspring.com/" },
  ],
  associations: [
      { title: "NABCEP", description: "The North American Board of Certified Energy Practitioners (NABCEP) is the most respected certification organization for renewable energy professionals.", href: "https://www.nabcep.org/" },
      { title: "The American Solar Energy Society (ASES)", description: "ASES is a non-profit organization that advocates for sustainable living and 100% renewable energy.", href: "https://ases.org/" },
  ]
}

type ResourceCardProps = {
  title: string;
  description: string;
  href: string;
};

function ResourceCard({ title, description, href }: ResourceCardProps) {
    return (
        <Card className="flex flex-col">
            <CardHeader className="flex flex-row items-start gap-4 space-y-0 flex-grow">
                <div className="bg-secondary p-3 rounded-lg mt-1">
                    <Globe className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-1">
                    <CardTitle className="font-headline text-lg">{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </div>
            </CardHeader>
            <CardFooter>
                <Button asChild variant="outline">
                  <a href={href} target="_blank" rel="noopener noreferrer">
                    Visit Site <ArrowUpRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
            </CardFooter>
        </Card>
    );
}

export default function ResourcesPage() {
  return (
    <Tabs defaultValue="gov" className="w-full">
      <div className="flex items-center justify-between mb-4">
        <TabsList>
          <TabsTrigger value="gov">Government & Policy</TabsTrigger>
          <TabsTrigger value="news">Industry News</TabsTrigger>
          <TabsTrigger value="educational">Educational</TabsTrigger>
          <TabsTrigger value="associations">Associations</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="gov">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {resources.gov.map(res => <ResourceCard key={res.title} {...res} />)}
        </div>
      </TabsContent>
      <TabsContent value="news">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {resources.news.map(res => <ResourceCard key={res.title} {...res} />)}
        </div>
      </TabsContent>
      <TabsContent value="educational">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {resources.educational.map(res => <ResourceCard key={res.title} {...res} />)}
        </div>
      </TabsContent>
      <TabsContent value="associations">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {resources.associations.map(res => <ResourceCard key={res.title} {...res} />)}
        </div>
      </TabsContent>
    </Tabs>
  )
}
