import axios from "./axios";
import { API } from "./endpoints";

export const getProducts = async (page = 1, size = 10, search?: string, category?: string) => {
  try {
    const response = await axios.get(API.PRODUCTS.GET_ALL, {
      params: { page, size, search, category }
    });
    return response.data;
  } catch (error: Error | any) {
    throw new Error(error.response?.data?.message || error.message || 'Failed to fetch products');
  }
};

export const getFeaturedProducts = async () => {
  try {
    const response = await axios.get(API.PRODUCTS.GET_FEATURED);
    return response.data;
  } catch (error: Error | any) {
    throw new Error(error.response?.data?.message || error.message || 'Failed to fetch featured products');
  }
};

export const getProductsByCategory = async (category: string) => {
  try {
    const response = await axios.get(API.PRODUCTS.GET_BY_CATEGORY(category));
    return response.data;
  } catch (error: Error | any) {
    throw new Error(error.response?.data?.message || error.message || 'Failed to fetch products by category');
  }
};

export const getProductById = async (id: string) => {
  try {
    const response = await axios.get(API.PRODUCTS.GET_BY_ID(id));
    return response.data;
  } catch (error: Error | any) {
    throw new Error(error.response?.data?.message || error.message || 'Failed to fetch product');
  }
};

export const createProduct = async (productData: any) => {
  try {
    const response = await axios.post(API.PRODUCTS.CREATE, productData);
    return response.data;
  } catch (error: Error | any) {
    throw new Error(error.response?.data?.message || error.message || 'Failed to create product');
  }
};

export const updateProduct = async (id: string, productData: any) => {
  try {
    const response = await axios.put(API.PRODUCTS.UPDATE(id), productData);
    return response.data;
  } catch (error: Error | any) {
    throw new Error(error.response?.data?.message || error.message || 'Failed to update product');
  }
};

export const deleteProduct = async (id: string) => {
  try {
    const response = await axios.delete(API.PRODUCTS.DELETE(id));
    return response.data;
  } catch (error: Error | any) {
    throw new Error(error.response?.data?.message || error.message || 'Failed to delete product');
  }
};
