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
  const { items, totalPages }: { items: Product[]; totalPages: number } =
    await fetchEbayProducts(currentPage, query, sort, buyItNow, auction);
  return (
    <>
      <Products items={items} />
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </>
  );
}
