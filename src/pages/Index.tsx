import { useState, useEffect } from 'react';
import { getProducts } from '@/service/ecomService';
import { motion } from 'framer-motion';
import { ShoppingCart, Store } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { Cart } from '@/components/Cart';
import { CheckoutModal } from '@/components/CheckoutModal';
import { ReceiptModal } from '@/components/ReceiptModal';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { useCartStore } from '@/store/cartStore';
import { mockProducts } from '@/data/products';
import Autoplay from 'embla-carousel-autoplay';
import { useNavigate } from 'react-router-dom';
import { Product } from '@/store/cartStore';

const Index = () => {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [receiptData, setReceiptData] = useState({ name: '', email: '', date: '' });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = (await getProducts()) as { status: number; data: Product[] };
        if (response.status == 200) {
          // console.log("Fetched products:", response);
          setProducts(response.data as Product[]);
        } else {
          console.error("Unexpected response format:", response);
        }
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);


  const { addItem, getTotalItems, clearCart } = useCartStore();
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <Store className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Vibe Commerce
              </h1>
            </motion.div>

            <div className="flex items-center gap-3">
              <ThemeToggle />

              <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="relative">
                    <ShoppingCart className="h-5 w-5" />
                    {getTotalItems() > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-2 -right-2 bg-primary text-primary-foreground w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold shadow-glow"
                      >
                        {getTotalItems()}
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

      {/* Hero Section */}
      <section className="bg-gradient-primary py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center text-primary-foreground mb-12"
          >
            <h2 className="text-5xl font-bold mb-4">
              Welcome to Vibe Commerce
            </h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Discover premium products with seamless shopping experience
            </p>
          </motion.div>

          {/* Featured Products Carousel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-5xl mx-auto"
          >
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              plugins={[
                Autoplay({
                  delay: 3000,
                }),
              ]}
              className="w-full"
            >
              <CarouselContent>
                {mockProducts.slice(0, 4).map((product) => (
                  <CarouselItem key={product._id} className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-2">
                      <Card
                        className="border-white/20 bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all cursor-pointer group"
                        onClick={() => navigate(`/product/${product._id}`)}
                      >
                        <CardContent className="p-4">
                          <div className="aspect-square mb-4 overflow-hidden rounded-lg">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          <h3 className="font-semibold text-lg text-primary-foreground mb-2 line-clamp-1">
                            {product.name}
                          </h3>
                          <p className="text-primary-foreground/80 text-sm mb-3 line-clamp-2">
                            {product.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold text-primary-foreground">
                              ₹{product.price}
                            </span>
                            <span className="text-xs text-primary-foreground/70 bg-white/20 px-2 py-1 rounded">
                              {product.category}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex -left-12 border-white/20 bg-white/10 hover:bg-white/20 text-primary-foreground" />
              <CarouselNext className="hidden md:flex -right-12 border-white/20 bg-white/10 hover:bg-white/20 text-primary-foreground" />
            </Carousel>
          </motion.div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h3 className="text-3xl font-bold mb-2">Featured Products</h3>
          <p className="text-muted-foreground">Browse our curated collection</p>
        </motion.div>

        {loading ? (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-card h-72 rounded-2xl shadow-md border border-border"
              >
                <div className="h-2/3 bg-muted rounded-t-2xl" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </div>
              </div>
            ))}
          </motion.div>
        ) : products.length === 0 ? (
          <motion.div
            className="text-center py-16 text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <p>No products found. Try again later.</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {products.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                <ProductCard product={product} onAddToCart={addItem} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>
      {/* Modals */}
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

export default Index;
