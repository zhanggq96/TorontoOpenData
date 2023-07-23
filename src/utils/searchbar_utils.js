// export function filterItems(items, query) {
//   query = query.toLowerCase();
//   return items.filter(item =>
//     item.geojson.split(' ').some(word =>
//       word.toLowerCase().startsWith(query)
//     )
//   );
// }

// ChatGPT:
// This modified function will return a new array that contains 
// only the elements from the items array where every word in the 
// query string matches the start of some word in item.attributes.geojson.location.
export function filterItems(items, query) {
  const queryWords = query.toLowerCase().split(" ");

  return items.filter((item) =>
    queryWords.every((queryWord) =>
      item.attributes.geojson.location
        .split(" ")
        .some((word) => word.toLowerCase().startsWith(queryWord))
    )
  );
}

export function SearchBar({ query, onChange }) {
  return (
    <form>
      <div className="flex basicmap-font">
        <label
          htmlFor="search-dropdown"
          className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
        >
          Your Email
        </label>
        {/* Removed dropdown */}
        <div className="relative w-full">
          <input
            type="search"
            id="search-dropdown"
            className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-lg border-l-gray-50 border-l-2 border border-gray-300 focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:border-l-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-pink-500"
            placeholder="Search Locations"
            value={query}
            onChange={onChange}
          />
          <button
            type="submit"
            className="absolute top-0 right-0 p-2.5 text-sm font-medium h-full text-white bg-pink-500 rounded-r-lg border border-pink-700 hover:bg-pink-800 focus:ring-4 focus:outline-none focus:ring-pink-300 dark:bg-pink-600 dark:hover:bg-pink-700 dark:focus:ring-pink-800"
          >
            <svg
              className="w-4 h-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
            <span className="sr-only">Search</span>
          </button>
        </div>
      </div>
    </form>
  );
}


{
  /* <button
  id="dropdown-button"
  data-dropdown-toggle="dropdown"
  class="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-l-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600"
  type="button"
>
  All categories{" "}
  <svg
    class="w-2.5 h-2.5 ml-2.5"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 10 6"
  >
    <path
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="m1 1 4 4 4-4"
    />
  </svg>
</button> 
<div
  id="dropdown"
  class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
>
  <ul
    class="py-2 text-sm text-gray-700 dark:text-gray-200"
    aria-labelledby="dropdown-button"
  >
    <li>
      <button
        type="button"
        class="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
      >
        Mockups
      </button>
    </li>
    <li>
      <button
        type="button"
        class="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
      >
        Templates
      </button>
    </li>
    <li>
      <button
        type="button"
        class="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
      >
        Design
      </button>
    </li>
    <li>
      <button
        type="button"
        class="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
      >
        Logos
      </button>
    </li>
  </ul>
</div> */
}