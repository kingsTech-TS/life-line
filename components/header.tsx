"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, ChevronDown } from "lucide-react"
import { Button } from "./ui/button"


export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  const navLinks = [
    { href: "/", label: "Home" },
    {
      label: "About",
      submenu: [
        { href: "/about?section=about-lifeline", label: "About LifeLine" },
        { href: "/about?section=about-nphn", label: "About NPHN" },
        { href: "/meet-team", label: "Meet the Team" },
        { href: "/why-exist", label: "Why We Exist" },
      ],
    },
    { href: "/shop", label: "Shop" },
    { href: "/donate", label: "Donate" },
    {
      label: "Impact",
      submenu: [
        { href: "/impact?section=impact-report", label: "Our Impact Report" },
        { href: "/donations", label: "Donations" },
        { href: "/projects", label: "Projects" },
      ],
    },
    { href: "/finances", label: "Finances" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
              L
            </div>
            <span className="hidden font-bold text-foreground sm:inline-block">LifeLine</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <div key={link.label || link.href} className="relative group">
                {"submenu" in link ? (
                  <>
                    <button className="text-sm font-medium text-foreground hover:text-primary transition-colors flex items-center gap-1">
                      {link.label}
                      <ChevronDown size={16} />
                    </button>
                    <div className="absolute left-0 mt-0 w-48 bg-background border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      {link.submenu?.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="block px-4 py-2 text-sm text-foreground hover:bg-muted first:rounded-t-lg last:rounded-b-lg"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link
                    href={link.href}
                    className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Button asChild variant="outline" size="sm" className="bg-primary hover:bg-primary/90 text-white">
              <Link href="/donate">Donate Now</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="md:hidden pb-4 space-y-2">
            {navLinks.map((link) => (
              <div key={link.label || link.href}>
                {"submenu" in link ? (
                  <>
                    <button
                      onClick={() => setOpenDropdown(openDropdown === link.label ? null : link.label)}
                      className="w-full text-left px-4 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-md flex items-center justify-between"
                    >
                      {link.label}
                      <ChevronDown size={16} className={openDropdown === link.label ? "rotate-180" : ""} />
                    </button>
                    {openDropdown === link.label && (
                      <div className="ml-4 space-y-1">
                        {link.submenu?.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="block px-4 py-2 text-sm text-foreground hover:bg-muted rounded-md"
                            onClick={() => setIsOpen(false)}
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={link.href}
                    className="block px-4 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-md"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}
            <Button asChild className="w-full mt-4">
              <Link href="/donate">Donate Now</Link>
            </Button>
          </nav>
        )}
      </div>
    </header>
  )
}
