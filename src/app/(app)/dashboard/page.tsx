
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ArrowUpRight, Wrench, PlusCircle, Home, Building2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Customer
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href="/toolbox/proposal-generator?customerType=Residential">
                <Home className="mr-2 h-4 w-4" />
                <span>Residential</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/toolbox/proposal-generator?customerType=Commercial">
                <Building2 className="mr-2 h-4 w-4" />
                <span>Commercial</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
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

      <div className="grid gap-8">
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
              <Link href="/toolbox">
                Explore Tools <ArrowUpRight className="ml-2" />
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
