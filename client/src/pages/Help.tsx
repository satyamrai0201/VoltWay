import { Card } from "@/components/ui/card";
import { MessageSquare, MailIcon, MapPin } from "lucide-react";

export default function Help() {
  const faqs = [
    {
      question: "How do I book a charging station?",
      answer: "Navigate to 'Find Stations', select a station from the map, and click 'Book Now'. Fill in your details and complete the payment to confirm your booking.",
    },
    {
      question: "How can I become a host?",
      answer: "Click on 'Become a Host' to list your charging station. Fill in the station details, set your pricing, and upload images. Your station will be live once verified.",
    },
    {
      question: "What payment methods are accepted?",
      answer: "We accept all major credit and debit cards through our secure Stripe payment gateway.",
    },
    {
      question: "Can I cancel my booking?",
      answer: "Yes, you can cancel bookings from your 'My Bookings' page. Cancellations made 24 hours before the booking receive a full refund.",
    },
    {
      question: "How do I leave a review?",
      answer: "After completing a charging session, you'll be able to leave a review and rating for the station.",
    },
    {
      question: "What charger types do you support?",
      answer: "We support Type 2, CCS2, and CHAdeMO chargers at our stations across India.",
    },
  ];

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Help Center</h1>
          <p className="text-lg text-muted-foreground">
            Find answers to common questions about VoltWay
          </p>
        </div>

        <div className="grid gap-6 mb-12">
          {faqs.map((faq, index) => (
            <Card key={index} className="p-6">
              <h3 className="text-lg font-semibold mb-3 text-foreground">{faq.question}</h3>
              <p className="text-muted-foreground">{faq.answer}</p>
            </Card>
          ))}
        </div>

        <Card className="p-8 bg-accent/10">
          <h2 className="text-2xl font-bold mb-6 text-foreground">Still need help?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <MessageSquare className="w-6 h-6 text-lime-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">Chat with us</h3>
                <p className="text-sm text-muted-foreground">
                  Our support team is available 24/7 to help you with any questions.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <MailIcon className="w-6 h-6 text-lime-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">Email us</h3>
                <p className="text-sm text-muted-foreground">
                  support@voltway.com - We'll respond within 24 hours
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
