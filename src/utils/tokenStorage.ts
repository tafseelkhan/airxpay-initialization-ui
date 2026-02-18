// src/utils/tokenStorage.ts

import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../etc/constants';

export const getStoredToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.MERCHANT_TOKEN);
  } catch {
    return null;
  }
};

export const setStoredToken = async (token: string): Promise<void> => {
  if (!token?.trim()) {
    throw new Error('Invalid token');
  }
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.MERCHANT_TOKEN, token);
  } catch (error) {
    console.error('Failed to store token:', error);
    throw error;
  }
};

export const clearStoredToken = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.MERCHANT_TOKEN);
  } catch (error) {
    console.error('Failed to clear token:', error);
    throw error;
  }
};

export const storeMerchantData = async (data: any): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.MERCHANT_DATA, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to store merchant data:', error);
  }
};

export const getStoredMerchantData = async (): Promise<any | null> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.MERCHANT_DATA);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};