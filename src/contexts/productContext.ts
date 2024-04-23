import { Pagination } from "@/types/Pagination";
import { Product } from "@/types/Product";
import { createContext } from "react";

export const ProductsContext = createContext<Pagination<Product>>({ limit: 20, total: 0, products: [], skip: 0 });