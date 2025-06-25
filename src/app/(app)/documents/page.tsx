
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
import { Download, FileText } from "lucide-react"

const documents = {
  residential: [
    { title: "Homeowner's Guide to Solar", description: "A comprehensive guide for residential solar installations.", size: "2.5 MB" },
    { title: "Residential PV Sizing Worksheet", description: "Template to calculate the right system size for a home.", size: "300 KB" },
    { title: "DIY Solar Installation Manual", description: "Step-by-step instructions for the handy homeowner.", size: "5.1 MB" },
    { title: "Understanding Your Utility Bill", description: "Learn how to read your bill after going solar.", size: "1.1 MB" },
  ],
  commercial: [
    { title: "Commercial Solar ROI Calculator", description: "Excel template to calculate return on investment for businesses.", size: "1.2 MB" },
    { title: "Flat Roof Installation Guide", description: "Best practices for installing solar on commercial flat roofs.", size: "4.8 MB" },
    { title: "Solar PPA Agreement Template", description: "A template for Power Purchase Agreements.", size: "500 KB" },
    { title: "C&I Permitting Checklist", description: "A checklist for commercial and industrial solar permitting.", size: "250 KB" },
  ],
}

type DocumentCardProps = {
  title: string;
  description: string;
  size: string;
};

function DocumentCard({ title, description, size }: DocumentCardProps) {
    return (
        <Card className="flex flex-col">
            <CardHeader className="flex flex-row items-start gap-4 space-y-0 flex-grow">
                <div className="bg-secondary p-3 rounded-lg mt-1">
                    <FileText className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-1">
                    <CardTitle className="font-headline text-lg">{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </div>
            </CardHeader>
            <CardFooter className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">{size}</span>
                <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Download</Button>
            </CardFooter>
        </Card>
    );
}

export default function DocumentsPage() {
  return (
    <Tabs defaultValue="residential" className="w-full">
      <div className="flex items-center justify-between mb-4">
        <TabsList>
          <TabsTrigger value="residential">Residential</TabsTrigger>
          <TabsTrigger value="commercial">Commercial</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="residential">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {documents.residential.map(doc => <DocumentCard key={doc.title} {...doc} />)}
        </div>
      </TabsContent>
      <TabsContent value="commercial">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {documents.commercial.map(doc => <DocumentCard key={doc.title} {...doc} />)}
        </div>
      </TabsContent>
    </Tabs>
  )
}
