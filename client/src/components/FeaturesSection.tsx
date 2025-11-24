import { motion } from "framer-motion";
import { Zap, MapPin, Calendar, Shield } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Instant Booking",
    description: "Reserve your charging spot in seconds with real-time availability.",
  },
  {
    icon: MapPin,
    title: "Smart Navigation",
    description: "Find the nearest stations with live updates and route optimization.",
  },
  {
    icon: Calendar,
    title: "Schedule Ahead",
    description: "Plan your charging sessions in advance for a seamless journey.",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description: "Safe and encrypted transactions with multiple payment options.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-24 px-6 bg-foreground text-background relative overflow-hidden" data-testid="section-features">
      <div className="absolute inset-0 bg-gradient-to-b from-foreground via-foreground/95 to-foreground" />
      
      <div className="relative max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold leading-tight">
            All the must haves of an{" "}
            <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full inline-block">
              EV charging app.
            </span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-background/5 rounded-3xl p-8 hover-elevate border border-background/10"
              data-testid={`card-feature-${index}`}
            >
              <div className="mb-6">
                <div className="inline-flex gap-2">
                  <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <feature.icon className="text-primary" size={24} />
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-background">{feature.title}</h3>
              <p className="text-background/70 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
