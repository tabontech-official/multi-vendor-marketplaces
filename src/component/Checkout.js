import { useEffect, useState } from "react";
import axios from "axios";  // assuming you're using axios for API requests

export const CreateCheckoutUrl = (userData, quantity, loading, error, variantId) => {
  if (loading) {
    throw new Error('Loading user data...');
  }

  // Check for errors in user data
  if (error || !userData) {
    throw new Error('User data is required or an error occurred.');
  }

  // Construct and return the full URL for checkout directly
  return `https://www.medspatrader.com/cart/${variantId}:${quantity}?${new URLSearchParams({
    'checkout[email]': userData.email || '',
    'checkout[billing_address][first_name]': userData.firstName || '',
    'checkout[billing_address][last_name]': userData.lastName || '',
    'checkout[billing_address][address1]': userData.address || '',
    'checkout[billing_address][city]': userData.city || '',
    'checkout[billing_address][province]': userData.province || '',
    'checkout[billing_address][zip]': userData.zip || '',
    'checkout[billing_address][phone]': userData.phoneNumber || '',
    'checkout[billing_address][country]': userData.country || ''
  }).toString()}`;
};
