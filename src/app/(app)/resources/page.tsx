import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ArrowUpRight } from "lucide-react"
import Link from "next/link"

const resources = [
  { name: "DSIRE", description: "Database of State Incentives for Renewables & Efficiency. The most comprehensive source of information on incentives and policies that support renewables and energy efficiency in the United States.", category: "Incentives", url: "https://www.dsireusa.org/" },
  { name: "NREL", description: "National Renewable Energy Laboratory. A national laboratory of the U.S. Department of Energy, NREL is the nation's primary laboratory for renewable energy and energy efficiency research and development.", category: "Research", url: "https://www.nrel.gov/" },
  { name: "SEIA", description: "Solar Energy Industries Association. The national trade association for the U.S. solar industry.", category: "Industry News", url: "https://www.seia.org/" },
  { name: "PVWatts Calculator", description: "A free online tool from NREL that estimates the energy production and cost of energy of grid-connected photovoltaic (PV) energy systems.", category: "Tools", url: "https://pvwatts.nrel.gov/" },
  { name: "Solar Power World", description: "An online and print publication covering the latest news and technology in the solar industry.", category: "Industry News", url: "https://www.solarpowerworldonline.com/" },
  { name: "Greentech Media", description: "Leading information services provider for the next-generation electricity system.", category: "News", url: "https://www.greentechmedia.com/" },
]

export default function ResourcesPage() {
  return (
    <Card>
      <CardHeader>
          <CardTitle className="font-headline">External Resources Directory</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Resource</TableHead>
                <TableHead className="hidden sm:table-cell">Category</TableHead>
                <TableHead className="text-right">Link</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resources.map((resource) => (
                <TableRow key={resource.name}>
                  <TableCell>
                    <div className="font-medium font-headline">{resource.name}</div>
                    <div className="text-sm text-muted-foreground hidden md:inline max-w-md">{resource.description}</div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge variant="outline">{resource.category}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={resource.url} target="_blank" rel="noopener noreferrer">
                        Visit Site <ArrowUpRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
