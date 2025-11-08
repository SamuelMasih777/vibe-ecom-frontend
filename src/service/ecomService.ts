import { endPoint } from "@/utils/config";
import { deleteRequest, getRequest, postRequest, putRequest } from "@/utils/request";
const BASE_URL_PRODUCT = endPoint.product;
const BASE_URL_CART = endPoint.cart;
const BASE_URL_CHECKOUT = endPoint.checkout;

// const BASE_URL = endPoint.admin;
// const BASE_URL1=endPoint.warehouse;

// export const deleteAd = async (id: string) => {
//   const url = BASE_URL + `/ads/${id}`;
//   return await deleteRequest(url, {
//     headers: {
//       authorization: `Bearer ${getToken()}`,
//     },
//   });
// };

// export const updateAd = async (id: string, data: any) => {
//   const url = BASE_URL + `/ads/${id}`;
//   return await putRequest(url, data, {
//     headers: {
//       authorization: `bearer ${getToken()}`,
//     },
//   });
// };

export const getProducts = async () => {
  const url = `${BASE_URL_PRODUCT}/`;
  return await getRequest(url);
};

export const getProductById = async (productId: string) => {
  const url = `${BASE_URL_PRODUCT}/${productId}`;
  return await getRequest(url);
};

export const getCart = async () => {
  const url = `${BASE_URL_CART}/`;
  return getRequest(url);
};

export const addToCart = async (productId: string, qty: number) => {
  const url = `${BASE_URL_CART}/`;
  return postRequest(url, { productId, qty });
};

export const removeFromCart = async (cartItemId: string) => {
  const url = `${BASE_URL_CART}/${cartItemId}`;
  return deleteRequest(url);
};

export const updateCartItem = async (cartItemId: string, qty: number) => {
  const url = `${BASE_URL_CART}/${cartItemId}`;
  return putRequest(url, { qty });
};

export const checkout = async (name: string, email: string) => {
  const url = `${BASE_URL_CHECKOUT}/`;
  return postRequest(url, { name, email });
};
// export const getTripsAndFineStats = async (data: any) => {
//   const url = BASE_URL + "/trips-daily-ops-stats";
//   const token: any = localStorage.getItem(config.myrikAdminToken);
//   try {
//     const response = await getRequest(url, data, {
//       authorization: `bearer ${JSON.parse(token).data.token}`,
//     });
//     return response;
//   } catch (error) {
//     throw error;
//   }
// };
