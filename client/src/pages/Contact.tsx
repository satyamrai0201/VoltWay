import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message sent!",
      description: "Thank you for reaching out. We'll get back to you soon.",
    });
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Contact Us</h1>
          <p className="text-lg text-muted-foreground">
            Get in touch with our team. We'd love to hear from you.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6">
            <Mail className="w-8 h-8 text-lime-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-foreground">Email</h3>
            <p className="text-muted-foreground text-sm">
              <a href="mailto:support@voltway.com" className="hover:text-lime-400">
                support@voltway.com
              </a>
            </p>
          </Card>

          <Card className="p-6">
            <Phone className="w-8 h-8 text-lime-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-foreground">Phone</h3>
            <p className="text-muted-foreground text-sm">
              <a href="tel:+919876543210" className="hover:text-lime-400">
                +91 9876 543 210
              </a>
            </p>
          </Card>

          <Card className="p-6">
            <MapPin className="w-8 h-8 text-lime-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-foreground">Address</h3>
            <p className="text-muted-foreground text-sm">
              Bangalore, India
            </p>
          </Card>
        </div>

        <Card className="p-8">
          <h2 className="text-2xl font-bold mb-6 text-foreground">Send us a message</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-lime-400"
                  placeholder="Your name"
                  data-testid="input-contact-name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-lime-400"
                  placeholder="your@email.com"
                  data-testid="input-contact-email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-lime-400"
                placeholder="How can we help?"
                data-testid="input-contact-subject"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-4 py-2 rounded-lg border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-lime-400 resize-none"
                placeholder="Tell us more..."
                data-testid="textarea-contact-message"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-lime-400 text-black hover:bg-lime-500 font-semibold py-3"
              data-testid="button-contact-submit"
            >
              Send Message
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
