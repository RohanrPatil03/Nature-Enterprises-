
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, BookMarked, Wrench, MessageSquare, PlusCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-end">
        <Button asChild>
          <Link href="/toolbox/proposal-generator">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Customer
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documents</CardTitle>
            <BookMarked className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">125</div>
            <p className="text-xs text-muted-foreground">
              +12 since last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tools & Calculators</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +2 new tools added
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Forum Topics</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">573</div>
            <p className="text-xs text-muted-foreground">
              +201 since last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <div className="h-4 w-4 bg-primary rounded-full animate-pulse"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2,350</div>
            <p className="text-xs text-muted-foreground">
              Online now
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="font-headline">Quick Links</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="space-y-4">
              <Link href="/documents" className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary transition-colors">
                <div className="flex items-center gap-4">
                  <div className="bg-secondary p-3 rounded-lg">
                    <BookMarked className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold font-headline">Document Library</h3>
                    <p className="text-sm text-muted-foreground">Guides, datasheets, and more</p>
                  </div>
                </div>
                <ArrowUpRight className="h-5 w-5 text-muted-foreground" />
              </Link>
              <Link href="/toolbox" className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary transition-colors">
                <div className="flex items-center gap-4">
                  <div className="bg-secondary p-3 rounded-lg">
                    <Wrench className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold font-headline">Toolbox</h3>
                    <p className="text-sm text-muted-foreground">Calculators and design aids</p>

                  </div>
                </div>
                <ArrowUpRight className="h-5 w-5 text-muted-foreground" />
              </Link>
              <Link href="/forum" className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary transition-colors">
                <div className="flex items-center gap-4">
                  <div className="bg-secondary p-3 rounded-lg">
                    <MessageSquare className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold font-headline">Community Forum</h3>
                    <p className="text-sm text-muted-foreground">Ask questions and share knowledge</p>
                  </div>
                </div>
                <ArrowUpRight className="h-5 w-5 text-muted-foreground" />
              </Link>
            </div>
          </CardContent>
        </Card>
        <Card className="flex flex-col overflow-hidden">
          <Image
            src="https://placehold.co/600x400.png"
            alt="Solar panels on a roof"
            data-ai-hint="solar panels"
            width={600}
            height={400}
            className="object-cover w-full h-48"
          />
          <CardHeader>
            <CardTitle className="font-headline">Go Solar with Confidence</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-muted-foreground">Our curated resources are designed to empower your solar journey, from initial planning to final installation. Get the data and tools you need to succeed.</p>
          </CardContent>
          <div className="p-6 pt-0">
            <Button asChild>
              <Link href="/documents">
                Explore Resources <ArrowUpRight className="ml-2" />
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
