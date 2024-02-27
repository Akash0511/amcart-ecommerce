export interface Product {
    _id: {
      $oid: string;
    };
    id: number;
    name: string;
    price: number;
    image: string;
    description: string;
    size?: string[]; // Optional field for size
    section: string;
  }
  