"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Heart,
} from "lucide-react";

export default function Footer() {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith("/admin");

  if (isAdminPage) return null;

  return (
    <footer className="relative bg-zinc-950 text-zinc-400 overflow-hidden border-t border-zinc-800/50">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 right-0 -translate-y-1/2 w-96 h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 w-96 h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative w-full max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Brand & Mission */}
          <div className="lg:col-span-4 space-y-6">
            <Link
              href="/"
              className="inline-block transition-transform hover:scale-105"
            >
              <Image
                src="/logo/logo.png"
                alt="LifeLine Logo"
                width={140}
                height={48}
                className="h-10 w-auto invert brightness-200"
              />
            </Link>
            <p className="text-sm leading-relaxed max-w-xs">
              Empowering communities through accessible healthcare and
              sustainable wellness initiatives across Nigeria.
            </p>
            <div className="flex items-center gap-4 pt-4">
              {[
                { icon: Twitter, href: "#", label: "Twitter" },
                { icon: Facebook, href: "#", label: "Facebook" },
                { icon: Instagram, href: "#", label: "Instagram" },
                { icon: Linkedin, href: "#", label: "LinkedIn" },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center border border-zinc-800 hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all duration-300"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm font-medium">
              {[
                { label: "About Us", href: "/about" },
                { label: "Our Projects", href: "/projects" },
                { label: "Shop", href: "/shop" },
                { label: "Impact Stories", href: "/impact" },
                { label: "Contact Us", href: "/contact" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="hover:text-primary transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-0 h-[1px] bg-primary group-hover:w-3 transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Support
            </h3>
            <ul className="space-y-3 text-sm font-medium">
              {[
                { label: "Make a Donation", href: "/donate" },
                { label: "Volunteer", href: "/contact" },
                { label: "FAQ", href: "#" },
                { label: "Privacy Policy", href: "#" },
                { label: "Terms of Use", href: "#" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="hover:text-primary transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-0 h-[1px] bg-primary group-hover:w-3 transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-4 space-y-6">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Get in Touch
            </h3>
            <div className="space-y-4">
              <a
                href="mailto:hello@lifeline.ng"
                className="flex items-center gap-4 group p-4 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-primary/20 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-xs text-zinc-500 font-medium">
                    Email Address
                  </p>
                  <p className="text-sm text-zinc-300 group-hover:text-white transition-colors">
                    hello@lifeline.ng
                  </p>
                </div>
              </a>

              <a
                href="tel:+2341234567890"
                className="flex items-center gap-4 group p-4 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-primary/20 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-xs text-zinc-500 font-medium">
                    Phone Number
                  </p>
                  <p className="text-sm text-zinc-300 group-hover:text-white transition-colors">
                    +234 (0) 123 456 7890
                  </p>
                </div>
              </a>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/50">
                <div className="w-10 h-10 rounded-xl bg-zinc-800/50 flex items-center justify-center">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-xs text-zinc-500 font-medium">
                    Headquarters
                  </p>
                  <p className="text-sm text-zinc-300 font-medium">
                    Lagos, Nigeria
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-semibold tracking-wider uppercase">
          <p>
            © 2025 Lifeline Foundation. Built with{" "}
            <Heart
              size={12}
              className="inline-block text-red-500 mx-1 animate-pulse"
            />{" "}
            for humanity.
          </p>
          <div className="flex items-center gap-8">
            <Link href="#" className="hover:text-primary transition-colors">
              Accessibility
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Cookies
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
