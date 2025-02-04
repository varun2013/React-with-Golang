export interface BillingDetails {
  quantity: any;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  country: string;
  street_address: string;
  town_city: string;
  region: string;
  postcode: string;
  type: string;
  shipping_country: string;
  shipping_address: string;
  shipping_town_city: string;
  shipping_region: string;
  shipping_postcode: string;
  clinic_id: string;
}

export interface OrderSummary extends BillingDetails {
  product_name: string;
  product_description: string;
  product_image: string;
  product_price: number;
  product_gst_price: number;
  total_price?: number;
}
