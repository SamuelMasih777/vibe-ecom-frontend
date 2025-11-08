import { motion } from 'framer-motion';
import { ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Product, useCartStore } from '@/store/cartStore';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: string, qty?: number) => Promise<void>;
}

export const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem } = useCartStore();
  
  const cartItem = items.find(item => item._id === product._id);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product._id) {
      toast({
        title: 'Product _id missing:',
        description: `₹{product.name} cannot be added to cart.`,
        variant: "destructive",
      });
      return;
    }
    await onAddToCart(String(product._id));
    toast({
      title: 'Added to cart',
      description: `${product.name} has been added to your cart.`,
    });
  };


  const handleUpdateQuantity = async (e: React.MouseEvent, newQuantity: number) => {
    e.stopPropagation();
    if (!product || !product._id) {
      toast({
        title: "Update Failed",
        description: "Product data is invalid or missing.",
        variant: "destructive",
      });
      return;
    }
    await updateQuantity(String(product._id), newQuantity);
    if (newQuantity < 1) {
      toast({
        title: 'Removed from cart',
        description: `${product.name} has been removed from your cart.`,
      });
    }
  };

  const handleRemove = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product || !product._id) {
      toast({
        title: "Remove Failed",
        description: "This product cannot be removed — invalid or missing ID.",
        variant: "destructive",
      });
      console.error("Invalid product object for removal:", product);
      return;
    }
    await removeItem(String(product._id));
    toast({
      title: 'Removed from cart',
      description: `${product.name} has been removed from your cart.`,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      onClick={() => navigate(`/product/${product._id}`)}
    >
      <Card className="overflow-hidden border-border bg-gradient-card shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer">
        <div className="relative aspect-square overflow-hidden">
          <motion.img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />
          <div className="absolute top-3 right-3">
            <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
              {product.category}
            </span>
          </div>
        </div>
        
        <div className="p-5">
          <h3 className="font-bold text-lg mb-2 text-foreground">{product.name}</h3>
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
            {product.description}
          </p>
          
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-primary">
              ₹{product.price.toFixed(2)}
            </span>
            
            {!cartItem ? (
              <Button
                onClick={handleAddToCart}
                size="sm"
                className="bg-primary hover:bg-primary/90 shadow-glow"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  onClick={(e) => handleUpdateQuantity(e, cartItem.quantity - 1)}
                  size="icon"
                  variant="outline"
                  className="h-8 w-8"
                >
                  <Minus className="h-3 w-3" />
                </Button>
                
                <span className="font-semibold min-w-[2rem] text-center">
                  {cartItem.quantity}
                </span>
                
                <Button
                  onClick={(e) => handleUpdateQuantity(e, cartItem.quantity + 1)}
                  size="icon"
                  variant="outline"
                  className="h-8 w-8"
                >
                  <Plus className="h-3 w-3" />
                </Button>

                <Button
                  onClick={handleRemove}
                  size="icon"
                  variant="destructive"
                  className="h-8 w-8"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
