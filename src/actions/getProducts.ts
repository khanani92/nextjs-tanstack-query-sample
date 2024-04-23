import { PRODUCTS_PAGE_LIMIT } from "@/constants/ProductsPageLimit";
import { Pagination } from "@/types/Pagination";
import { Product } from "@/types/Product";

export async function getProducts({ pageParam }: { pageParam: number }) {
    let url = `https://dummyjson.com/products?limit=${PRODUCTS_PAGE_LIMIT}`;

    /* if we have gone over the limit of initial page load we need to set `skip` in API to avoid getting same data over and over */
    if (pageParam > PRODUCTS_PAGE_LIMIT) {
        url += `&skip=${pageParam - PRODUCTS_PAGE_LIMIT}`;
    }

    const productsAPI = await fetch(url);

    const products: Pagination<Product> = await productsAPI.json();

    return products;
}
