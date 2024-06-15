import { Product } from "../lib/definitions";

type Props = {
  items: Product[];
};

const Products = async ({ items }: Props) => {
  return (
    <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
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
          <span className="font-bold text-gray-900 dark:text-white">
            $
            {product.buyingOptions[0] == "AUCTION"
              ? product.currentBidPrice.value
              : product.price.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export default Products;
