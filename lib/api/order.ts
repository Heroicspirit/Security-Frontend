import axios from "./axios";
import { API } from "./endpoints";

export const createOrder = async (orderData: any) => {
  try {
    const response = await axios.post(API.ORDERS.CREATE, orderData);
    return response.data;
  } catch (error: Error | any) {
    throw new Error(error.response?.data?.message || error.message || 'Failed to create order');
  }
};

export const getOrders = async (page = 1, size = 10) => {
  try {
    const response = await axios.get(API.ORDERS.GET_ALL, {
      params: { page, size }
    });
    return response.data;
  } catch (error: Error | any) {
    throw new Error(error.response?.data?.message || error.message || 'Failed to fetch orders');
  }
};

export const getMyOrders = async (page = 1, size = 10) => {
  try {
    const response = await axios.get(API.ORDERS.GET_MY_ORDERS, {
      params: { page, size }
    });
    return response.data;
  } catch (error: Error | any) {
    throw new Error(error.response?.data?.message || error.message || 'Failed to fetch my orders');
  }
};

export const getOrderById = async (id: string) => {
  try {
    const response = await axios.get(API.ORDERS.GET_BY_ID(id));
    return response.data;
  } catch (error: Error | any) {
    throw new Error(error.response?.data?.message || error.message || 'Failed to fetch order');
  }
};

export const getOrderByOrderNumber = async (orderNumber: string) => {
  try {
    const response = await axios.get(API.ORDERS.GET_BY_ORDER_NUMBER(orderNumber));
    return response.data;
  } catch (error: Error | any) {
    throw new Error(error.response?.data?.message || error.message || 'Failed to fetch order');
  }
};

export const updateOrderStatus = async (id: string, status: string) => {
  try {
    const response = await axios.put(API.ORDERS.UPDATE_STATUS(id), { status });
    return response.data;
  } catch (error: Error | any) {
    throw new Error(error.response?.data?.message || error.message || 'Failed to update order status');
  }
};

export const updatePaymentStatus = async (id: string, status: string) => {
  try {
    const response = await axios.put(API.ORDERS.UPDATE_PAYMENT_STATUS(id), { status });
    return response.data;
  } catch (error: Error | any) {
    throw new Error(error.response?.data?.message || error.message || 'Failed to update payment status');
  }
};
