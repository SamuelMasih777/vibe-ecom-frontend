import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ShoppingCart,
  Package,
  Shield,
  Truck,
  Plus,
  Minus,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cartStore';
import { useToast } from '@/hooks/use-toast';
import { Footer } from '@/components/Footer';
import { ThemeToggle } from '@/components/ThemeToggle';
import { getProductById } from '@/service/ecomService';
import { Cart } from '@/components/Cart';
import { CheckoutModal } from '@/components/CheckoutModal';
import { ReceiptModal } from '@/components/ReceiptModal';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { items, addItem, updateQuantity, removeItem, clearCart } = useCartStore();

  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [receiptData, setReceiptData] = useState({ name: '', email: '', date: '' });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductById(id!);
        setProduct(response.data);
      } catch (err) {
        console.error('Error fetching product:', err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const cartItem = items.find((item) => item._id === id);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Loading product...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product not found</h2>
          <Button onClick={() => navigate('/')}>Back to Shop</Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = async () => {
    await addItem(product._id);
    toast({
      title: 'Added to cart',
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleUpdateQuantity = async (newQuantity: number) => {
    if (newQuantity < 1) {
      await removeItem(product._id);
      toast({
        title: 'Removed from cart',
        description: `${product.name} has been removed from your cart.`,
      });
    } else {
      await updateQuantity(product._id, newQuantity);
    }
  };

  const handleRemove = async () => {
    await removeItem(product._id);
    toast({
      title: 'Removed from cart',
      description: `${product.name} has been removed from your cart.`,
    });
  };

  // ✅ Checkout + receipt handling
  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleCheckoutComplete = (name: string, email: string) => {
    setIsCheckoutOpen(false);
    setReceiptData({
      name,
      email,
      date: new Date().toLocaleString(),
    });
    setIsReceiptOpen(true);
  };

  const handleReceiptClose = () => {
    setIsReceiptOpen(false);
    clearCart();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Back Button */}
            <Button variant="ghost" onClick={() => navigate('/')} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>

            {/* Center: Brand Name */}
            <h1
              onClick={() => navigate('/')}
              className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent cursor-pointer"
            >
              Vibe Commerce
            </h1>

            {/* Right: Theme + Cart */}
            <div className="flex items-center gap-3">
              <ThemeToggle />

              <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="relative">
                    <ShoppingCart className="h-5 w-5" />
                    {items.length > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-2 -right-2 bg-primary text-primary-foreground w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold shadow-glow"
                      >
                        {items.reduce((total, item) => total + item.quantity, 0)}
                      </motion.span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-lg p-0">
                  <Cart onCheckout={handleCheckout} />
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Product Detail */}
      <div className='container mx-auto px-4 py-4'>
      <main className="flex-1 container mx-auto px-4 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="relative aspect-square rounded-2xl overflow-hidden bg-card shadow-lg"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col gap-6"
          >
            <div>
              <span className="inline-block px-3 py-1 text-xs font-semibold bg-primary/10 text-primary rounded-full mb-4">
                {product.category}
              </span>
              <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
              <p className="text-3xl font-bold text-primary mb-6">
                ₹{product.price.toFixed(2)}
              </p>
            </div>

            <div className="prose prose-sm max-w-none">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 py-6 border-y border-border">
              <div className="flex flex-col items-center gap-2 text-center">
                <Truck className="h-6 w-6 text-primary" />
                <span className="text-xs text-muted-foreground">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <Shield className="h-6 w-6 text-primary" />
                <span className="text-xs text-muted-foreground">2 Year Warranty</span>
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <Package className="h-6 w-6 text-primary" />
                <span className="text-xs text-muted-foreground">In Stock</span>
              </div>
            </div>

            {!cartItem ? (
              <Button
                size="lg"
                onClick={handleAddToCart}
                className="w-full gap-2 shadow-glow hover:scale-105 transition-transform"
              >
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </Button>
            ) : (
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => handleUpdateQuantity(cartItem.quantity - 1)}
                  size="icon"
                  variant="outline"
                  className="h-12 w-12"
                >
                  <Minus className="h-5 w-5" />
                </Button>

                <span className="text-2xl font-bold min-w-[3rem] text-center">
                  {cartItem.quantity}
                </span>

                <Button
                  onClick={() => handleUpdateQuantity(cartItem.quantity + 1)}
                  size="icon"
                  variant="outline"
                  className="h-12 w-12"
                >
                  <Plus className="h-5 w-5" />
                </Button>

                <Button
                  onClick={handleRemove}
                  size="lg"
                  variant="destructive"
                  className="flex-1 gap-2"
                >
                  <Trash2 className="h-5 w-5" />
                  Remove from Cart
                </Button>
              </div>
            )}
          </motion.div>
        </motion.div>
      </main>
      </div>

      {/* ✅ Checkout + Receipt Modals */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onComplete={handleCheckoutComplete}
      />

      <ReceiptModal
        isOpen={isReceiptOpen}
        onClose={handleReceiptClose}
        customerName={receiptData.name}
        customerEmail={receiptData.email}
        orderDate={receiptData.date}
      />

      <Footer />
    </div>
  );
};

export default ProductDetail;
