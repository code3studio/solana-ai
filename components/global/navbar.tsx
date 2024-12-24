"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useState } from "react";
import ModeToggle from "./darkmode";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Image from "next/image";

const routes = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/tasks", label: "Tasks" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4">
        <div className="flex items-center space-x-4">
          <Link href="/" className="font-bold text-xl">
            <Image src={"/solana-logo.png"} width={40} height={40} alt="Logo" />
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex ml-auto items-center space-x-4">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {route.label}
            </Link>
          ))}
          <WalletMultiButton
            style={{
              backgroundColor: "var(--geist-foreground)",
              color: "var(--geist-background)",
              scale: "small",
              padding: "0.5rem 1rem",
            }}
          />
          <ModeToggle />
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden flex ml-auto">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col space-y-4 mt-4">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    onClick={() => setIsOpen(false)}
                    className="text-sm font-medium transition-colors hover:text-primary"
                  >
                    {route.label}
                  </Link>
                ))}
                <Button className="w-full">Sign up</Button>
              </div>
            </SheetContent>
          </Sheet>
          <ModeToggle />
          <WalletMultiButton />
        </div>
      </div>
    </nav>
  );
}
