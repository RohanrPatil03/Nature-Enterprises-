'use client'

import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
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
import { ArrowUpRight, PlusCircle, Home, Building2, Users } from "lucide-react"
import Link from "next/link"
import { getProposals, ProposalDocument } from "@/services/proposalService"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDistanceToNow } from 'date-fns'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function DashboardPage() {
  const [customerCount, setCustomerCount] = useState(0)
  const [recentProposals, setRecentProposals] = useState<ProposalDocument[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const proposals = await getProposals()
        setCustomerCount(proposals.length)
        setRecentProposals(proposals.slice(0, 5))
      } catch (error) {
        console.error("Failed to fetch dashboard data", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

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
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <div className="text-2xl font-bold">{customerCount}</div>
            )}
            <Link href="/customers" className="text-xs text-muted-foreground hover:underline flex items-center">
              View all customers <ArrowUpRight className="ml-1 h-3 w-3" />
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Customers</CardTitle>
            <CardDescription>
              Your 5 most recently added customers.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
               <div className="space-y-4">
                  <div className="flex items-center space-x-4"><Skeleton className="h-10 w-10 rounded-full" /><div className="space-y-2"><Skeleton className="h-4 w-[200px]" /><Skeleton className="h-4 w-[150px]" /></div></div>
                  <div className="flex items-center space-x-4"><Skeleton className="h-10 w-10 rounded-full" /><div className="space-y-2"><Skeleton className="h-4 w-[200px]" /><Skeleton className="h-4 w-[150px]" /></div></div>
                  <div className="flex items-center space-x-4"><Skeleton className="h-10 w-10 rounded-full" /><div className="space-y-2"><Skeleton className="h-4 w-[200px]" /><Skeleton className="h-4 w-[150px]" /></div></div>
               </div>
            ) : recentProposals.length > 0 ? (
              <div className="space-y-4">
                {recentProposals.map((proposal) => (
                  <div key={proposal.id} className="flex items-center">
                    <Avatar className="h-9 w-9">
                       <AvatarImage src="https://placehold.co/100x100.png" alt="Avatar" data-ai-hint="person avatar" />
                      <AvatarFallback>{proposal.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">{proposal.name}</p>
                      <p className="text-sm text-muted-foreground">{proposal.address}</p>
                    </div>
                    <div className="ml-auto font-medium text-muted-foreground text-xs">
                        {proposal.createdAt ? formatDistanceToNow(proposal.createdAt.toDate(), { addSuffix: true }) : ''}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
                 <div className="text-center py-10 text-muted-foreground">
                    <Users className="mx-auto h-12 w-12" />
                    <p className="mt-4">No customers have been added yet.</p>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
