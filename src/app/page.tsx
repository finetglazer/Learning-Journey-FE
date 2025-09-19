"use client"
import { SearchIcon, MailIcon, LockIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
export default function InputWithIcons() {
  return (
    <div className="flex justify-center">
      <div className="space-y-6">
        {/* Search with icon */}
        <div className="relative w-full max-w-sm">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="pl-10"
          />
        </div>
        {/* Email with icon */}
        <div className="grid w-full max-w-sm items-center gap-3">
          <Label htmlFor="email-icon">Email</Label>
          <div className="relative">
            <MailIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email-icon"
              type="email"
              placeholder="Enter your email"
              className="pl-10"
            />
          </div>
        </div>
        {/* Password with icon */}
        <div className="grid w-full max-w-sm items-center gap-3">
          <Label htmlFor="password-icon">Password</Label>
          <div className="relative">
            <LockIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password-icon"
              type="password"
              placeholder="Enter password"
              className="pl-10"
            />
          </div>
        </div>
      </div>
    </div>
  )
}