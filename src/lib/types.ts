export type User = {
  id: number | undefined;
  firstName: string | undefined;
  lastName: string;
  username: string;
  chatSession?: boolean;
};

export type Price = {
  quantity: number;
  amount: number;
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

export type Category = {
  id?: string;
  name: string;
  active?: boolean;
};
