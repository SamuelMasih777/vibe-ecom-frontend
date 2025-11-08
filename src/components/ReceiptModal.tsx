import { motion } from 'framer-motion';
import { CheckCircle2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useCartStore } from '@/store/cartStore';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerName: string;
  customerEmail: string;
  orderDate: string;
}

export const ReceiptModal = ({
  isOpen,
  onClose,
  customerName,
  customerEmail,
  orderDate,
}: ReceiptModalProps) => {
  const { items, getTotalPrice } = useCartStore();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="space-y-6 pt-4"
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-flex items-center justify-center w-16 h-16 bg-success/10 rounded-full mb-4"
            >
              <CheckCircle2 className="h-10 w-10 text-success" />
            </motion.div>
            <h2 className="text-2xl font-bold mb-2">Order Successful!</h2>
            <p className="text-muted-foreground">
              Thank you for your purchase, {customerName}
            </p>
          </div>

          <div className="bg-accent rounded-lg p-6 space-y-4">
            <div>
              <p className="text-sm text-accent-foreground font-semibold mb-1">Order Date</p>
              <p className="text-foreground">{orderDate}</p>
            </div>
            
            <div>
              <p className="text-sm text-accent-foreground font-semibold mb-1">Email</p>
              <p className="text-foreground">{customerEmail}</p>
            </div>

            <div className="border-t border-border pt-4">
              <p className="text-sm text-accent-foreground font-semibold mb-3">Order Items</p>
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item._id} className="flex justify-between text-sm">
                    <span className="text-foreground">
                      {item.name} <span className="text-muted-foreground">x{item.quantity}</span>
                    </span>
                    <span className="font-semibold text-foreground">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-foreground">Total</span>
                <span className="text-2xl font-bold text-primary">
                  ₹{getTotalPrice().toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Close
            </Button>
            <Button
              className="flex-1 bg-primary hover:bg-primary/90"
              onClick={onClose}
            >
              <Download className="h-4 w-4 mr-2" />
              Download Receipt
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};
