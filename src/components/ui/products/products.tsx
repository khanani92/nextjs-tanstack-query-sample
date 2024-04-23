import { Pagination } from "@/types/Pagination";
import { Product } from "@/types/Product";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Card, CardContent, CardFooter } from "../card";
import { getProducts } from "@/actions/getProducts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PRODUCTS_PAGE_LIMIT } from "@/constants/ProductsPageLimit";
import { ProductsContext } from "@/contexts/productContext";
import Link from "next/link";

export default function Products() {
    const [ref, inView] = useInView();
    const { limit, skip, total, products } = useContext(ProductsContext);

    useEffect(() => {
        if (inView) {
            fetchNextPage();
        }
    }, [inView]);

    useEffect(() => {
        /* set the page scroll to top before refresh so on next page load the page isnt fully scrolled down to avoid triggering an scrollintoview change */
        window.onbeforeunload = () => {
            window.scrollTo({ top: 0, behavior: "smooth" })
        }
    }, []);

    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetching,
    } = useInfiniteQuery({
        queryKey: ['products'],
        queryFn: getProducts,
        initialPageParam: 20,
        getNextPageParam: (lastPage: Pagination<Product>, pages: Pagination<Product>[]) => {
            /***
             * lastPage: whatever the last response is from our API
             * pages: is a list that contains our all previous API respones
             * we are basically checking if our last API limit in addition to the products we have skipped have reached total 
             * number of products, we are returning undefined as that sets `hasNextPage` to true otherwise we just need to
             * set our `initialPageParam` to be the limit we have set times the pages we have gathered so far an addition to next page
             */

            return (lastPage.limit + lastPage.skip === lastPage.total) ? undefined : PRODUCTS_PAGE_LIMIT * (pages.length + 1);
        },
        /* we dont need to rerun queries based on these events */
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        /* we need to disable query on component mount */
        enabled: false,
        /* initial state we got from server side */
        initialData: { pages: [{ limit, skip, total, products }], pageParams: [PRODUCTS_PAGE_LIMIT] }
    });

    if (error) return "Error";

    if (data) return (
        <div className="px-4">
            <div className="my-4">
                <h1 className="text-4xl font-bold">Products</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 gap-4 mb-4">
                {data.pages.map((page) => page.products.map((product, index) => <Card key={index} className="max-w-xs">
                    <CardContent>
                        <div className="relative mt-6 rounded-lg flex h-60 overflow-hidden">
                            <img className="object-cover w-full" src={product.thumbnail} />

                            <Badge variant={"secondary"} className="absolute top-0 right-0 m-2">
                                {product.rating}
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                                </svg>
                            </Badge>
                        </div>

                        <div className="mt-4">
                            <h5 className="text-xl tracking-tight text-slate-900 truncate">{product.title}</h5>
                        </div>

                        <div className="mt-2 flex items-center justify-between">
                            <p>
                                <span className="text-2xl font-bold text-slate-900">${(product.price - (product.price * product.discountPercentage / 100)).toFixed(0)}</span>
                                <span className="text-sm text-slate-900 line-through ml-1">${product.price}</span>
                            </p>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Link href="payment" className="w-full">
                            <Button variant="default" className="w-full">
                                Pay now
                            </Button>
                        </Link>
                    </CardFooter>
                </Card>))}
            </div>

            <div className="mb-4 text-center" ref={ref}>
                <h1 className="font-bold text-lg">
                    {isFetching ? `Loading more...` : !hasNextPage ? `We have fetched all products!` : ''}
                </h1>
            </div>
        </div>
    );
}