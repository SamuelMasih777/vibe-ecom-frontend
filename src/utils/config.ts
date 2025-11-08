const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const endPoint = {
  product: `${baseUrl}/api/products`,
  cart: `${baseUrl}/api/cart`,
  checkout: `${baseUrl}/api/checkout`,
};
