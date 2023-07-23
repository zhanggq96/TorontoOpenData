import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { filterItems } from "./utils/searchbar_utils";
import { SearchBar } from "./utils/searchbar_utils";
// import { Icon } from "leaflet";

import "./App.css";
import "leaflet/dist/leaflet.css";



function App() {
  const [locationData, setlocationData] = useState(null);

  const baseUrl = "http://35.183.91.143/";
  const endpoint = "/api/washroomdata/"; 
  // The trailing slash in the endpoint is absolutely critical
  // though I don't know why. If not present, the first slash will get
  // autocorrected to %2F.

  const url = new URL(endpoint, baseUrl).href;
  const request = new Request(url, {
    method: "GET", // specify the desired HTTP method
    // Add any additional headers or options if needed
  });
  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((json) => setlocationData(json))
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Routes>
        <Route
          exact
          path="/"
          element={
            <MapPageLayout
              locationData={locationData}
              setlocationData={setlocationData}
            ></MapPageLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

function MapPageLayout({ locationData, setlocationData }) {
  return (
    <div className="bg-gray-950 flex justify-center items-center min-h-screen p-10">
      <div className="canvas flex">
        <div id="map" className="leaflet-container w-3/4 h-full">
          <BasicMap></BasicMap>
        </div>

        <div className="inline-block h-full mx-4 w-0.5 self-stretch bg-neutral-100 opacity-100 dark:opacity-50"></div>

        <div className="filterablelist w-1/4 h-full">
          <FilterableList
            className="h-full"
            items={locationData}
          ></FilterableList>
        </div>
      </div>
    </div>
  );
}

function BasicMap( { locations, center } ) {
  return (
    <MapContainer
      center={[43.6226 + 0.05, -79.45 + 0.05]}
      zoom={13}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* locations.map((location) => 
      <Marker position={location}>
        <Popup>
          a.
        </Popup>
      </Marker>
      ) 
       */}
      <Marker position={[43.6226 + 0.05, -79.45 + 0.05]}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>
  );
}

function FilterableList( { items } ) {
  const [query, setQuery] = useState("");
  
  console.log(items);

  var results = null;
  if (items) {
    results = filterItems(
      items.data,
      query
    );
  } else {
    return <div>Loading...</div>;
  }

  function handleChange(e) {
    setQuery(e.target.value);
  }

  return (
    // This nested div is to make the overflow + top align work properly.
    // Without the nested div, either (1) overflow but not top align, or
    // (2) top align but not overflow.
    // See: https://chat.openai.com/c/e52a3b12-f47d-443e-aef6-5f1b3b76783a
    // <div className="pl-4 container mx-auto h-full rounded-lg grid place-items-start overflow-y-auto flex ">
    //   <div className="flex-1 grid place-items-center overflow-y-auto w-full">
    //     <div className="w-full">
    //       <SearchBar className="w-full" query={query} onChange={handleChange} />
    //     </div>
    //     {/* <hr /> */}
    //     <div className="w-full">
    //       <LocationList items={results} />
    //     </div>
    //   </div>
    // </div>

    // Removed overflow-y-auto from this one so it has no scrollwheel
    // Added h-full so it takes space of parent container

    // EDIT: Had issue where doing h-full would make this 640px, height of parent, but
    // don't want that since searchbar above it takes up some space already.
    // Soln was: https://stackoverflow.com/questions/64257049/how-to-fill-up-the-rest-of-the-screen-height-using-tailwindcss
    // tldr: Put className="flex flex-col" in outer with searchbar
    // className="overflow-y-auto flex-grow" in inner
    // outer takes height of parent
    // inner uses flex-grow to fill remaining space
    <div className="flex flex-col h-full w-full">
      <SearchBar className="w-full" query={query} onChange={handleChange} />
      <div className="mx-0 rounded-lg place-items-start overflow-y-auto flex-grow">
        {/* <div className="place-items-center overflow-y-auto w-full h-full">
          <LocationList items={results} />
        </div> */}
        <LocationList items={results} />
      </div>
    </div>
  );
}

// function SearchBar({ query, onChange }) {
//   return (
//     <label className="w-full">
//       Search: <input value={query} onChange={onChange} />
//     </label>
//   );
// }

// Template: https://transmit.tailwindui.com/
function LocationList({ items }) {
  const spliced_items = items.slice(0, 10);
  return (
    <div className="py-1 basicmap-font">
      {spliced_items.map((item) => (
        <div
          key={item.attributes.opendata_id}
          className="mb-4 flex flex-col items-start basicmap-item-box"
        >
          <h2 id="episode-5-title" className="text-lg font-bold text-slate-900">
            <a href="/5">{item.attributes.geojson.location}</a>
          </h2>
          <p className="mt-1 text-base leading-5 text-slate-700">
            {item.attributes.geojson.type}
          </p>
          {/* <time
            dateTime="2022-02-24T00:00:00.000Z"
            className="font-mono text-sm leading-7 text-slate-500"
          >
            Last Updated: {item.attributes.date_updated}
          </time> */}
          <p className="mt-1 font-mono text-xs leading-7 text-slate-500 leading-normal">
            Address: {item.attributes.geojson.address}
          </p>
          <p className="font-mono text-xs leading-7 text-slate-500 leading-normal">
            {item.attributes.geojson.location_details}
          </p>
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="flex items-center text-sm font-bold leading-6 text-pink-500 hover:text-pink-700 active:text-pink-900"
              aria-label={item.attributes.geojson.type}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 10 10"
                fill="none"
                className="h-2.5 w-2.5 fill-current"
              >
                <path d="M8.25 4.567a.5.5 0 0 1 0 .866l-7.5 4.33A.5.5 0 0 1 0 9.33V.67A.5.5 0 0 1 .75.237l7.5 4.33Z"></path>
              </svg>
              <span className="ml-3" aria-hidden="true">
                Additional Information
              </span>
            </button>
            <span
              aria-hidden="true"
              className="text-sm font-bold text-slate-400"
            ></span>
          </div>
        </div>
      ))}
    </div>
  );
}

// const LocationlistFrame = ({ children }) => {
//   return (
//     <div className="w-full h-full items-center justify-center">
//       <div className="w-full h-full overflow-y-auto">
//         {children}
//       </div>
//     </div>
//   );
// };

export default App;
