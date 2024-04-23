export type Pagination<T> = {
    products: T[];
    total: number;
    limit: number;
    skip: number;
}