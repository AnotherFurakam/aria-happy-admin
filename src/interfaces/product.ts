export interface Product {
  idProduct: string;
  name: string;
  description: string;
  urlImage: string;
  isActive: boolean;
  createAt: string;
}

export interface ProductForm {
  name: string;
  urlImage: string;
  description: string;
}
