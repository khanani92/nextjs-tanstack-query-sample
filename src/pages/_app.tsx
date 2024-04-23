import { ProductsQueryProvider } from "@/providers/productsQueryProvider";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return <ProductsQueryProvider> <Component {...pageProps} /> </ProductsQueryProvider>;
}
