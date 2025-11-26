import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const BOT_RESPONSES: Record<string, string> = {
  "find stations": "You can find charging stations by going to 'Find Stations' in the navigation menu. Use the search bar to filter by city or charger type.",
  "how to book": "To book a charging station: 1) Find a station you like 2) Click on it to view details 3) Select your preferred time slot 4) Complete the booking. You'll receive a confirmation email.",
  "bookings": "Access your bookings by clicking 'My Bookings' in the navigation. Here you can view all your past and upcoming bookings.",
  "become a host": "To become a host, visit your profile and click 'Become a Host' button. Fill in your station details and you'll be ready to earn!",
  "pricing": "Pricing varies by station and location. Check individual station listings to see hourly rates. Home Stations offer special discounted rates!",
  "home stations": "Home Stations are community-hosted chargers with great rates and special lime-green badges. They're a budget-friendly option for charging.",
  "support": "Need help? Visit our Help page or Contact page. You can also reach out to us directly through the Contact form.",
  "hello": "Hello! I'm VoltWay's assistant. Ask me about finding stations, booking, hosting, or anything else about our platform!",
  "hi": "Hello! I'm VoltWay's assistant. Ask me about finding stations, booking, hosting, or anything else about our platform!",
  "help": "I can help you with: finding stations, booking, becoming a host, pricing, home stations, and more. What would you like to know?",
  "default": "I'm here to help! You can ask me about finding stations, booking a charger, becoming a host, or navigating the website. What would you like to know?",
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I'm VoltWay's assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const findBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase().trim();

    // Direct matches
    for (const [key, value] of Object.entries(BOT_RESPONSES)) {
      if (key !== "default" && lowerMessage.includes(key)) {
        return value;
      }
    }

    // Keyword matches
    if (
      lowerMessage.includes("station") ||
      lowerMessage.includes("charger") ||
      lowerMessage.includes("find")
    ) {
      return BOT_RESPONSES["find stations"];
    }
    if (lowerMessage.includes("book") || lowerMessage.includes("reserve")) {
      return BOT_RESPONSES["how to book"];
    }
    if (lowerMessage.includes("host")) {
      return BOT_RESPONSES["become a host"];
    }
    if (lowerMessage.includes("price") || lowerMessage.includes("cost")) {
      return BOT_RESPONSES["pricing"];
    }
    if (lowerMessage.includes("home")) {
      return BOT_RESPONSES["home stations"];
    }

    return BOT_RESPONSES["default"];
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate bot thinking time
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: findBotResponse(input),
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsLoading(false);
    }, 500);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        onClick={() => setIsOpen(!isOpen)}
        style={{ position: 'fixed', bottom: 32, right: 32, zIndex: 9999 }}
        className="hover-elevate active-elevate-2 rounded-full bg-lime-400 text-black p-4 shadow-lg"
        data-testid="button-chatbot-toggle"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-8 z-40 w-96 max-h-96 shadow-2xl"
            data-testid="chatbot-window"
          >
            <Card className="flex flex-col h-full rounded-3xl bg-background border border-lime-400/30">
              {/* Header */}
              <div className="bg-gradient-to-r from-lime-400 to-lime-500 text-black p-4 rounded-t-3xl font-bold text-lg flex items-center justify-between">
                <span>VoltWay Assistant</span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="hover:bg-lime-600 rounded-full p-1"
                  data-testid="button-close-chatbot"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-3">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${
                        message.sender === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                      data-testid={`message-${message.sender}`}
                    >
                      <div
                        className={`max-w-xs px-4 py-2 rounded-2xl ${
                          message.sender === "user"
                            ? "bg-lime-400 text-black rounded-br-none"
                            : "bg-muted text-foreground rounded-bl-none"
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                      </div>
                    </motion.div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-muted px-4 py-2 rounded-2xl rounded-bl-none">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-foreground rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-foreground rounded-full animate-bounce delay-100" />
                          <div className="w-2 h-2 bg-foreground rounded-full animate-bounce delay-200" />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={scrollRef} />
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="p-4 border-t flex gap-2">
                <Input
                  placeholder="Ask me anything..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSendMessage();
                    }
                  }}
                  disabled={isLoading}
                  className="rounded-full border-lime-400/30 focus-visible:ring-lime-400"
                  data-testid="input-chatbot"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isLoading || !input.trim()}
                  size="icon"
                  className="rounded-full bg-lime-400 text-black hover:bg-lime-500"
                  data-testid="button-send-message"
                >
                  <Send size={18} />
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
