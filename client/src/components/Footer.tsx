import { Link } from "wouter";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  const footerSections = [
    {
      title: "Product",
      links: [
        { id: "find-stations", label: "Find Stations", href: "/find-stations" },
        { id: "my-bookings", label: "My Bookings", href: "/bookings" },
        { id: "how-it-works", label: "How It Works", href: "/" },
      ],
    },
    {
      title: "For Hosts",
      links: [
        { id: "become-host", label: "Become a Host", href: "/host/new" },
        { id: "host-dashboard", label: "Host Dashboard", href: "/host/dashboard" },
      ],
    },
    {
      title: "Account",
      links: [
        { id: "profile", label: "Profile", href: "/profile" },
      ],
    },
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
  ];

  return (
    <footer className="bg-muted border-t py-20 px-6" data-testid="footer-main">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold mb-4 text-foreground">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link: any) => (
                  <li key={link.id}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                      data-testid={`link-footer-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t gap-6">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-2xl font-bold" data-testid="link-logo">
              VoltWay
            </Link>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} VoltWay. All rights reserved.
            </p>
          </div>

          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                className="h-10 w-10 rounded-full bg-muted-foreground/10 hover-elevate flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                aria-label={social.label}
                data-testid={`link-social-${social.label.toLowerCase()}`}
              >
                <social.icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
