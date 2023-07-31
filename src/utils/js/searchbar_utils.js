// This modified function will return a new array that contains 
// only the elements from the items array where every word in the 
// query string matches the start of some word in item.attributes.geojson.location.
export function filterSearchTerm(items, query) {
  const queryWords = query.toLowerCase().split(" ");

  return items.filter((item) =>
    queryWords.every((queryWord) =>
      item.attributes.geojson.location
        .split(" ")
        .some((word) => word.toLowerCase().startsWith(queryWord))
    )
  );
}

export function PointIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 10 10"
      fill="none"
      className="h-2.5 w-2.5 fill-current"
    >
      <path d="M8.25 4.567a.5.5 0 0 1 0 .866l-7.5 4.33A.5.5 0 0 1 0 9.33V.67A.5.5 0 0 1 .75.237l7.5 4.33Z"></path>
    </svg>
  );
}

export function SearchIcon() {
  return (
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
  );
}

export function SearchIconButton( {children} ) {
  return (
    <button
      type="submit"
      className="absolute top-0 right-0 p-2.5 text-sm font-medium h-full text-white bg-pink-500 rounded-r-lg border border-pink-700 hover:bg-pink-800 focus:ring-4 focus:outline-none focus:ring-pink-300 dark:bg-pink-600 dark:hover:bg-pink-700 dark:focus:ring-pink-800 button"
      disabled
    >
      {children}
    </button>
  );
}

export function SearchBar({ query, onChange, text, customClass }) {
  return (
    <form>
      <div className={`flex basicmap-font ${customClass}`}>
        <label
          htmlFor="search-dropdown"
          className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
        >
          {text}
        </label>
        {/* Removed dropdown */}
        <div className="relative w-full">
          <input
            type="search"
            id="search-dropdown"
            className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-lg border-l-gray-50 border-l-2 border border-gray-300 focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:border-l-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-pink-500 inputbar"
            placeholder={text}
            value={query}
            onChange={onChange}
          />
          <SearchIconButton>
            <SearchIcon></SearchIcon>
          </SearchIconButton>
        </div>
      </div>
    </form>
  );
}

export function LocationSearchBar({ query, onChange }) {
  return <SearchBar query={query} onChange={onChange} text="Search Locations"></SearchBar>;
}

export function FacilityFilterSearchBar({ query, onChange }) {
  return (
    <SearchBar
      query={query}
      onChange={onChange}
      text="Filter by facility (e.g. fountain)"
      customClass="my-2"
    ></SearchBar>
  );
}

export function ExpandInfo({ item, text, onclick, customClass }) {
  return (
    <button
      type="button"
      className={`flex items-center text-sm font-bold leading-6 text-pink-500 hover:text-pink-700 active:text-pink-900 ${customClass}`}
      aria-label={item.attributes.geojson.type}
      onClick={function () {
        onclick(item);
      }}
    >
      <PointIcon></PointIcon>
      <span className="ml-3" aria-hidden="true">
        {text}
      </span>
    </button>
  );
}