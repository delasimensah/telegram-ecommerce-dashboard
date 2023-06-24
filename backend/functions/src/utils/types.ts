export type User = {
  id: number | undefined;
  firstName: string | undefined;
  lastName: string;
  username: string;
  chatSession?: boolean;
};

export type Price = {
  name: string;
  price: number;
};

export type Product = {
  id?: string;
  name: string;
  description: string;
  photo: string;
  inStock: boolean;
  category: string;
  prices: Price[];
};

export type FormattedProduct = {
  id: string;
  name: {
    name: string;
    photo: string;
  };
  description: string;
  category: string;
  inStock: boolean;
  prices: Price[];
};

export type Category = {
  id?: string;
  name: string;
  active?: boolean;
};
