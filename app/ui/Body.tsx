import React from "react";
import Products from "./Products";
import Pagination from "./Pagination";
import { Product, Sort } from "../lib/definitions";
import { fetchEbayProducts } from "../lib/data";

type Props = {
  query: string;
  currentPage: number;
  sort: Sort;
  buyItNow: boolean;
  auction: boolean;
};

export default async function Main({
  query,
  currentPage,
  sort,
  buyItNow,
  auction,
}: Props) {
  const { items, totalPages, actualTotal, limit }: { 
    items: Product[]; 
    totalPages: number; 
    actualTotal?: number;
    limit: number;
  } = await fetchEbayProducts(currentPage, query, sort, buyItNow, auction);
  
  const maxDisplayableItems = totalPages * limit;
  const hasMoreResults = actualTotal && actualTotal > maxDisplayableItems;
  
  return (
    <>
      <Products items={items} />
      <div className="mt-5 flex w-full flex-col items-center">
        {hasMoreResults && (
          <div className="mb-3 text-sm text-gray-600">
            Showing {maxDisplayableItems.toLocaleString()} of {actualTotal.toLocaleString()} results. 
            Use more specific search terms to narrow down results.
          </div>
        )}
        <Pagination totalPages={totalPages} />
      </div>
    </>
  );
}
