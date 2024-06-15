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
    <div className="flex items-center mb-3">
      <div className="me-4 block">
        <input
          type="text"
          onChange={(e) => handleSearch(e.target.value)}
          defaultValue={searchParams.get("query"?.toString()) || ""}
          className=" text-sm rounded-lg block p-2 border focus:ring-blue-500 focus:border-blue-500"
          placeholder={placeholder}
        />
      </div>
      <div className="me-4 p-2 block ">
        <label>
          <input
            type="checkbox"
            className="me-2"
            onChange={(e) => handleCheck(e.target.checked, Buying.BIN)}
          />
          Buy It Now
        </label>
      </div>
      <div className="me-4 p-2 block">
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
      <div className="me-4 p-2 block">
        <label>
          <select
            className="block p-2 rounded-lg border focus:ring-blue-500 focus:border-blue-500 "
            onChange={(e) => handleSelect(e.target.value)}
          >
            <option defaultValue={Sort.NEWLY_LISTED}>Newly listed</option>
            <option value={Sort.ENDING_SOONEST}>Ending Soonest</option>
          </select>
        </label>
      </div>
    </div>
  );
};

export default Search;
