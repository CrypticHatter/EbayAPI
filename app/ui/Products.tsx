import { Product } from "../lib/definitions";
import { calcDuration } from "../lib/utils";

type Props = {
  items: Product[];
};

const Products = async ({ items }: Props) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
      {items?.map((product) => (
        <div
          key={product.itemId}
          className="w-full max-w-sm p-2 bg-white border hover:bg-slate-500 border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
        >
          <img
            className=" w-full rounded-lg h-60 "
            src={product.image?.imageUrl}
            alt="product image"
          />
          <a href={product.itemWebUrl}>
            <p className=" text-gray-900 dark:text-white text-sm pt-2">
              {product.title}
            </p>
          </a>
          <div className="block text-gray-900 text-center text-sm">
            <PriceBlock product={product} />
          </div>
        </div>
      ))}
    </div>
  );

  function PriceBlock({ product }: { product: Product }) {
    if (product.buyingOptions[0] == "AUCTION") {
      const duration = calcDuration(product.itemEndDate);
      return (
        <>
          <div className="font-bold">$ {product.currentBidPrice.value}</div>
          <div>Bid Count: {product.bidCount ?? 0}</div>
          <div>{duration}</div>
        </>
      );
    } else {
      return <div className="font-bold">$ {product.price.value}</div>;
    }
  }
};

export default Products;
