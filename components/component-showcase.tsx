import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

export function ComponentShowcase() {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="font-serif text-2xl font-semibold tracking-tight">Components</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          shadcn/ui components rendered with the &quot;cute one&quot; tokens.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <span className="font-mono text-xs text-muted-foreground">buttons</span>
        <div className="flex flex-wrap gap-3">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <span className="font-mono text-xs text-muted-foreground">badges</span>
        <div className="flex flex-wrap gap-3">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-serif">Create account</CardTitle>
            <CardDescription>Enter your details to get started.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Sofia Davis" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="m@example.com" />
            </div>
            <div className="flex items-center gap-3">
              <Switch id="newsletter" defaultChecked />
              <Label htmlFor="newsletter">Send me product updates</Label>
            </div>
          </CardContent>
          <CardFooter className="flex gap-3">
            <Button variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button className="flex-1">Create account</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-serif">Team members</CardTitle>
            <CardDescription>Invite your team to collaborate.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Tabs defaultValue="members">
              <TabsList className="w-full">
                <TabsTrigger value="members" className="flex-1">
                  Members
                </TabsTrigger>
                <TabsTrigger value="pending" className="flex-1">
                  Pending
                </TabsTrigger>
              </TabsList>
              <TabsContent value="members" className="flex flex-col gap-4 pt-4">
                {[
                  { name: "Sofia Davis", email: "m@example.com", role: "Owner", initials: "SD" },
                  { name: "Jackson Lee", email: "p@example.com", role: "Developer", initials: "JL" },
                ].map((m, i) => (
                  <div key={m.email} className="flex flex-col gap-4">
                    {i > 0 && <Separator />}
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{m.initials}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{m.name}</span>
                        <span className="text-xs text-muted-foreground">{m.email}</span>
                      </div>
                      <Badge variant="secondary" className="ml-auto">
                        {m.role}
                      </Badge>
                    </div>
                  </div>
                ))}
              </TabsContent>
              <TabsContent value="pending" className="pt-4">
                <p className="text-sm text-muted-foreground">No pending invitations.</p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
