"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "../ui/button";

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/logo.png"
              alt="Legali"
              width={120}
              height={40}
              className="h-8 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-8 md:flex">
            <div className="flex items-center space-x-6">
              <Link
                href="#solutions"
                className="text-deep-navy transition-colors hover:text-sky-blue-600"
              >
                Solutions
              </Link>
              <Link
                href="#features"
                className="text-deep-navy transition-colors hover:text-sky-blue-600"
              >
                Features
              </Link>
              <Link
                href="#about"
                className="text-deep-navy transition-colors hover:text-sky-blue-600"
              >
                About Us
              </Link>
              <Link
                href="#contact"
                className="text-deep-navy transition-colors hover:text-sky-blue-600"
              >
                Contact
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button
                  variant="ghost"
                  className="text-deep-navy hover:text-sky-blue-600"
                >
                  Log In
                </Button>
              </Link>
              <Link href="/welcome">
                <Button className="bg-emerald-green-400 text-white hover:bg-emerald-green-500">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-deep-navy"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="space-y-1 border-t border-white-200 bg-white px-2 pt-2 pb-3">
              <Link
                href="#solutions"
                className="block px-3 py-2 text-deep-navy transition-colors hover:text-sky-blue-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Solutions
              </Link>
              <Link
                href="#features"
                className="block px-3 py-2 text-deep-navy transition-colors hover:text-sky-blue-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="#about"
                className="block px-3 py-2 text-deep-navy transition-colors hover:text-sky-blue-600"
                onClick={() => setIsMenuOpen(false)}
              >
                About Us
              </Link>
              <Link
                href="#contact"
                className="block px-3 py-2 text-deep-navy transition-colors hover:text-sky-blue-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <div className="space-y-2 px-3 py-2">
                <Link href="/login">
                  <Button
                    variant="ghost"
                    className="w-full text-deep-navy hover:text-sky-blue-600"
                  >
                    Log In
                  </Button>
                </Link>
                <Link href="/welcome">
                  <Button className="w-full bg-emerald-green-400 text-white hover:bg-emerald-green-500">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
