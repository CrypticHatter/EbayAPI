import { Suspense } from "react";
import Search from "./ui/Search";
import ProductSkeleton from "./ui/Skeltons";
import { Sort } from "./lib/definitions";
import Body from "./ui/Body";

export default async function Home({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
    sort?: Sort;
    buyItNow?: string;
    auction?: string;
  };
}) {
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const sort = searchParams?.sort || Sort.NEWLY_LISTED;
  const buyItNow = searchParams?.buyItNow === "true" ? true : false || false;
  const auction = searchParams?.auction === "true" ? true : false || false;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4">
      <Search placeholder="Search" />
      <Suspense
        key={query + currentPage + sort + buyItNow + auction}
        fallback={<ProductSkeleton />}
      >
        <Body
          query={query}
          sort={sort}
          auction={auction}
          buyItNow={buyItNow}
          currentPage={currentPage}
        />
      </Suspense>
    </main>
  );
}
