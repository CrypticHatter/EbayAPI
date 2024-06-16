"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { Buying, Sort } from "../lib/definitions";

type Props = { placeholder: string };

const Search = ({ placeholder }: Props) => {
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathName}?${params.toString()}`);
  }, 300);

  const handleCheck = (checked: boolean, type: Buying) => {
    const params = new URLSearchParams(searchParams);
    params.set(type, checked.toString());

    replace(`${pathName}?${params.toString()}`);
  };

  const handleSelect = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("sort", value);
    replace(`${pathName}?${params.toString()}`);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 items-center gap-4 mb-3">
      <div>
        <input
          type="text"
          onChange={(e) => handleSearch(e.target.value)}
          defaultValue={searchParams.get("query"?.toString()) || ""}
          className=" text-sm rounded-lg block p-2 border focus:ring-blue-500 focus:border-blue-500"
          placeholder={placeholder}
        />
      </div>
      <div>
        <label>
          <select
            className="block p-2 rounded-lg border focus:ring-blue-500 focus:border-blue-500 "
            onChange={(e) => handleSelect(e.target.value)}
          >
            <option defaultValue={Sort.NEWLY_LISTED}>Newly listed</option>
            <option value={Sort.ENDING_SOONEST}>Ending Soonest</option>
            <option value={Sort.LOWEST_PRICE}>Lowest Price</option>
            <option value={Sort.HEIGHEST_PRICE}>Heighest Price</option>
          </select>
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            className="me-2"
            onChange={(e) => handleCheck(e.target.checked, Buying.BIN)}
          />
          Buy It Now
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            name="list-check"
            className="me-2"
            onChange={(e) => handleCheck(e.target.checked, Buying.AUCTION)}
          />
          Auctions
        </label>
      </div>
    </div>
  );
};

export default Search;
