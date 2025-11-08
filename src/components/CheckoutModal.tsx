import { useState } from "react";
import { CreditCard, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCartStore } from "@/store/cartStore";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (name: string, email: string) => void;
}

export const CheckoutModal = ({ isOpen, onClose, onComplete }: CheckoutModalProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { getTotalPrice } = useCartStore();

  const loadRazorpayScript = (src: string) => {
    return new Promise<boolean>((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    setIsLoading(true); // show loader
    onClose(); // close checkout modal

    const res = await loadRazorpayScript("https://checkout.razorpay.com/v1/checkout.js");

    if (!res) {
      setIsLoading(false);
      alert("Razorpay SDK failed to load. Check your internet connection.");
      return;
    }

    const totalAmount = getTotalPrice();

    const options = {
      key: "rzp_test_TjjuPWzx3qGFCj",
      amount: totalAmount * 100, // paise
      currency: "INR",
      name: "Vibe Commerce",
      description: "Order Payment",
      handler: (response: unknown) => {
        console.log("Payment successful:", response);
        setIsLoading(false);
        onComplete(name, email);
        setName("");
        setEmail("");
      },
      prefill: {
        name,
        email,
        contact: "8858690861",
      },
      theme: {
        color: "#3b82f6",
      },
      modal: {
        ondismiss: () => {
          // if user closes Razorpay without paying
          setIsLoading(false);
        },
      },
    };

    const paymentObject = new (window as any).Razorpay(options);
    paymentObject.open();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <CreditCard className="h-6 w-6 text-primary" />
              Checkout
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 pt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Samuel Masih"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="samuel@example.com"
                required
              />
            </div>

            <div className="bg-accent rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-accent-foreground font-semibold">
                  Total Amount
                </span>
                <span className="text-2xl font-bold text-primary">
                  ₹{getTotalPrice().toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-primary hover:bg-primary/90 shadow-glow"
              >
                Pay with Razorpay
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Full-screen Loader Overlay */}
      {isLoading && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-[9999]">
          <Loader2 className="h-10 w-10 animate-spin text-primary mb-3" />
          <p className="text-sm text-muted-foreground">Initializing payment...</p>
        </div>
      )}
    </>
  );
};
