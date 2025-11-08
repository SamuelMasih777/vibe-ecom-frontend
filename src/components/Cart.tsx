import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, ShoppingBag, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";

interface CartProps {
  onCheckout: () => void;
}

export const Cart = ({ onCheckout }: CartProps) => {
  const { items, removeItem, updateQuantity, getTotalPrice, getTotalItems } =
    useCartStore();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    setLoadingId(productId);
    updateQuantity(productId, newQuantity).finally(() => setLoadingId(null));
  };

  const handleRemove = (productId: string) => {
    setLoadingId(productId);
    removeItem(productId).finally(() => setLoadingId(null));
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-primary" />
            Your Cart
          </h2>
          <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
            {getTotalItems()} items
          </span>
        </div>
      </div>

      <ScrollArea className="flex-1 px-6">
        <AnimatePresence mode="popLayout">
          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-full py-12"
            >
              <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-lg">
                Your cart is empty
              </p>
            </motion.div>
          ) : (
            <div className="space-y-4 py-6">
              {items.map((item) => {
                const isLoading = loadingId === item._id;
                return (
                  <motion.div
                    key={item._id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.25 }}
                    className="flex gap-4 bg-card rounded-lg p-4 border border-border shadow-sm"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-md"
                    />

                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-foreground">
                          {item.name}
                        </h3>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemove(item._id)}
                          disabled={isLoading}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        >
                          {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <X className="h-4 w-4" />
                          )}
                        </Button>
                      </div>

                      <p className="text-primary font-bold mb-3">
                        ₹{item.price.toFixed(2)}
                      </p>

                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            handleQuantityChange(item._id, item.quantity - 1)
                          }
                          disabled={isLoading || item.quantity <= 1}
                          className="h-8 w-8"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>

                        <motion.span
                          key={item.quantity}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          transition={{ type: "spring", stiffness: 300 }}
                          className="font-semibold w-8 text-center"
                        >
                          {isLoading ? (
                            <Loader2 className="h-4 w-4 mx-auto animate-spin text-muted-foreground" />
                          ) : (
                            item.quantity
                          )}
                        </motion.span>

                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            handleQuantityChange(item._id, item.quantity + 1)
                          }
                          disabled={isLoading}
                          className="h-8 w-8"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </AnimatePresence>
      </ScrollArea>

      {items.length > 0 && (
        <div className="p-6 border-t border-border bg-card">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold">Total</span>
            <motion.span
              key={getTotalPrice()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-3xl font-bold text-primary"
            >
              ₹{getTotalPrice().toFixed(2)}
            </motion.span>
          </div>

          <Button
            onClick={onCheckout}
            className="w-full bg-primary hover:bg-primary/90 shadow-glow"
            size="lg"
          >
            Proceed to Checkout
          </Button>
        </div>
      )}
    </div>
  );
};
