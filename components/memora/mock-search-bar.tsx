"use client"

import * as React from "react"
import { Search } from "lucide-react"

// import { MotionButton } from "@/components/motion/motion-button"
import { Button } from "@/components/ui/button"

export function MockSearchBar() {
  const [query, setQuery] = React.useState("")

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 rounded-full bg-muted py-1.5 pl-4 pr-1.5">
      <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Ask your saved posts..."
        aria-label="Search your saved posts"
        className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
      />
      <Button
        type="submit"
        size="icon-sm"
        className="shrink-0 rounded-full"
        aria-label="Search"
      >
        <Search className="h-4 w-4" aria-hidden="true" />
      </Button>
    </form>
  )
}
