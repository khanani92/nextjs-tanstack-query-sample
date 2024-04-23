"use client";

import React, { useState } from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

function ProductsQueryProvider({ children }: any) {
    const [client] = useState(new QueryClient());

    return (
        <>
            <QueryClientProvider client={client}>
                {children}
            </QueryClientProvider>
        </>
    )
}

export { ProductsQueryProvider }    