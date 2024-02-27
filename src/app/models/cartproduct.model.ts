export interface CartProduct {
    _id: {
      $oid: string;
    };
    id: number;
    name: string;
    price: number;
    image: string;
    description: string;
    section: string;
    quantity: number;
  }
  