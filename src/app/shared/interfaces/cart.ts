export interface Cart {
    _id: string;
    userId: string;
    createdAt: string;
    total: {
      price: CartTotalPrice;
      quantity: number;
      products: number;
    };
    products: CartProduct[];
  }
  
  export interface CartProduct {
    quantity: number;
    pricePerQuantity: number;
    beforeDiscountPrice: number;
    productId: string;
  }
  
  export interface CartTotalPrice {
    current: number;
    beforeDiscount: number;
  }
  
  export interface CartItem {
    id: string;
    quantity: number;
  }
  