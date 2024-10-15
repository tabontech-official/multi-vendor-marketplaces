import { useEffect, useState } from "react";
import axios from "axios";  // assuming you're using axios for API requests

export const CreateCheckoutUrl = (userData, quantity, loading, error , variantId) => {
  
  
  if (loading) {
    throw new Error('Loading user data...');
  }

  // Check for errors in user data
  if (error || !userData) {
    throw new Error('User data is required or an error occurred.');
  }

  // Base URL for the cart, including the product ID and quantity
  const baseUrl = `https://www.medspatrader.com/cart/${variantId}:${quantity}`;

  // Constructing the query parameters for checkout
  const queryParams = new URLSearchParams({
    'checkout[email]': userData.email || '',
    'checkout[billing_address][first_name]': userData.firstName || '',
    'checkout[billing_address][last_name]': userData.lastName || '',
    'checkout[billing_address][address1]': userData.address || '',
    'checkout[billing_address][city]': userData.city || '',
    'checkout[billing_address][province]': userData.province || '',
    'checkout[billing_address][zip]': userData.zip || '',
    'checkout[billing_address][phone]': userData.phoneNumber || '',
    'checkout[billing_address][country]': userData.country || ''
  }).toString();

  // Constructing the full URL for checkout
  return `${baseUrl}?${queryParams}`
};