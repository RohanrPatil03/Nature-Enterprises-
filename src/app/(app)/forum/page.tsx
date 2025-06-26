
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
import { PlusCircle, MessageSquare, ThumbsUp } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"

const threads = [
    { id: 1, title: "Best panels for residential use in 2024?", author: "Jane Doe", authorImage: "https://placehold.co/100x100.png", replies: 12, likes: 34, category: "Residential" },
    { id: 2, title: "Question about inverter clipping", author: "John Smith", authorImage: "https://placehold.co/100x100.png", replies: 5, likes: 15, category: "Technical" },
    { id: 3, title: "Commercial solar financing options", author: "SolarBizPro", authorImage: "https://placehold.co/100x100.png", replies: 8, likes: 22, category: "Commercial" },
    { id: 4, title: "Utility-scale land lease rates discussion", author: "GridOperator", authorImage: "https://placehold.co/100x100.png", replies: 25, likes: 56, category: "Utility-Scale" },
    { id: 5, title: "DIY ground mount system - AMA", author: "DIYMaster", authorImage: "https://placehold.co/100x100.png", replies: 42, likes: 112, category: "DIY" },
    { id: 6, title: "New to solar, where to start?", author: "GreenBeginner", authorImage: "https://placehold.co/100x100.png", replies: 18, likes: 45, category: "General" },
]

export default function ForumPage() {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-end">
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create New Post
                </Button>
            </div>
            <Card>
              <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50%]">Topic</TableHead>
                            <TableHead className="hidden sm:table-cell">Category</TableHead>
                            <TableHead className="text-center hidden md:table-cell">Replies</TableHead>
                            <TableHead className="text-center hidden md:table-cell">Likes</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {threads.map((thread) => (
                            <TableRow key={thread.id} className="cursor-pointer hover:bg-muted/50">
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarImage src={`${thread.authorImage}?text=${thread.author.substring(0,2)}`} alt={thread.author} data-ai-hint="person avatar" />
                                            <AvatarFallback>{thread.author.substring(0,2).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-medium font-headline">{thread.title}</div>
                                            <div className="text-sm text-muted-foreground">by {thread.author}</div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="hidden sm:table-cell">
                                    <Badge variant="secondary">{thread.category}</Badge>
                                </TableCell>
                                <TableCell className="text-center hidden md:table-cell">
                                    <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
                                        <MessageSquare className="h-4 w-4" />
                                        <span className="font-medium">{thread.replies}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-center hidden md:table-cell">
                                    <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
                                        <ThumbsUp className="h-4 w-4" />
                                        <span className="font-medium">{thread.likes}</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
              </CardContent>
            </Card>
        </div>
    )
}
