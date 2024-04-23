import { getProducts } from "@/actions/getProducts";
import { Pagination } from "@/types/Pagination";
import { Product } from "@/types/Product";
import { ProductsContext } from "@/contexts/productContext";
import Products from "@/components/ui/products/products";
import { PRODUCTS_PAGE_LIMIT } from "@/constants/ProductsPageLimit";

type Props = Pagination<Product>;

export default function ProductsPage(props: Props) {
  return <ProductsContext.Provider value={{ ...props }}>
    <Products></Products>
  </ProductsContext.Provider>
}

/* get our initial first twenty products and pass them as a prop */
export async function getServerSideProps() {
  const initialProducts = await getProducts({ pageParam: PRODUCTS_PAGE_LIMIT });

  return {
    props: { ...initialProducts }
  }
}