"use client";

import { Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const navigation = {
  solutions: [
    { name: "AI Legal Assistant", href: "#" },
    { name: "Litigation Crowdfunding", href: "#" },
    { name: "Document Analysis", href: "#" },
    { name: "Legal Marketplace", href: "#" },
  ],
  support: [
    { name: "Help Center", href: "#" },
    { name: "Documentation", href: "#" },
    { name: "Contact Support", href: "#" },
    { name: "Status", href: "#" },
  ],
  company: [
    { name: "About", href: "#about" },
    { name: "Careers", href: "#" },
    { name: "Press", href: "#" },
    { name: "Partners", href: "#" },
  ],
  legal: [
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
    { name: "Cookie Policy", href: "#" },
    { name: "Compliance", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-6">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center space-x-2">
                <Image
                  src="/logo.png"
                  alt="Legali"
                  width={120}
                  height={40}
                  className="h-8 w-auto"
                />
              </Link>
              <p className="mt-4 max-w-md text-slate-gray-600">
                The smarter way to work with legal services. AI-powered platform
                for litigation, document analysis, and comprehensive legal
                solutions.
              </p>

              {/* Contact Info */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 text-sm text-slate-gray-600">
                  <Mail className="h-4 w-4 text-sky-blue-500" />
                  <span>support@legali.com</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-gray-600">
                  <Phone className="h-4 w-4 text-sky-blue-500" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-gray-600">
                  <MapPin className="h-4 w-4 text-sky-blue-500" />
                  <span>San Francisco, CA</span>
                </div>
              </div>
            </div>

            {/* Solutions */}
            <div>
              <h3 className="text-sm font-semibold tracking-wider text-deep-navy uppercase">
                Solutions
              </h3>
              <ul className="mt-4 space-y-3">
                {navigation.solutions.map(item => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-slate-gray-600 transition-colors hover:text-sky-blue-600"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-sm font-semibold tracking-wider text-deep-navy uppercase">
                Support
              </h3>
              <ul className="mt-4 space-y-3">
                {navigation.support.map(item => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-slate-gray-600 transition-colors hover:text-sky-blue-600"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-sm font-semibold tracking-wider text-deep-navy uppercase">
                Company
              </h3>
              <ul className="mt-4 space-y-3">
                {navigation.company.map(item => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-slate-gray-600 transition-colors hover:text-sky-blue-600"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-sm font-semibold tracking-wider text-deep-navy uppercase">
                Legal
              </h3>
              <ul className="mt-4 space-y-3">
                {navigation.legal.map(item => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-slate-gray-600 transition-colors hover:text-sky-blue-600"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Border */}
        <div className="border-t border-gray-200 py-8">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <p className="text-sm text-slate-gray-500">
              © 2024 Legali. All rights reserved.
            </p>
            <div className="mt-4 flex items-center space-x-6 md:mt-0">
              <Link
                href="#"
                className="text-slate-gray-400 transition-colors hover:text-sky-blue-500"
              >
                <span className="sr-only">Twitter</span>
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </Link>
              <Link
                href="#"
                className="text-slate-gray-400 transition-colors hover:text-sky-blue-500"
              >
                <span className="sr-only">LinkedIn</span>
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
