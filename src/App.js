import React, { useState, useEffect, createContext, useContext } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { filterItems, SearchBar } from "./utils/js/searchbar_utils";
import {
  iconMarker,
  mapInitZoom,
  mapInitCenter,
  latLng,
} from "./utils/js/leaflet_utils";

import "leaflet/dist/leaflet.css";
import "./App.css";
import "./utils/css/basicmap_customization.css";

// --- Map state data ---
const MapMarkerContext = createContext();
const UpdateMapMarkerContextFunction = createContext();
const MapCenterContext = createContext();
const UpdateMapCenterContextFunction = createContext();


function App() {
  // --- API state ---
  const [locationData, setlocationData] = useState(null);

  const baseUrl = "http://35.183.91.143/";
  const endpoint = "/api/washroomdata/";
  // The trailing slash in the endpoint is absolutely critical
  // though I don't know why. If not present, the first slash will get
  // autocorrected to %2F.

  const url = new URL(endpoint, baseUrl).href;
  // const request = new Request(url, {
  //   method: "GET", // specify the desired HTTP method
  //   // Add any additional headers or options if needed
  // });
  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((json) => setlocationData(json))
      .catch((error) => {
        console.error(error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- End API state ---
  // console.log(window.matchMedia("(prefers-color-scheme: light)").matches);

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

function CenterToMarkerLocationComponent({ coord }) {
  const map = useMap();
  const targetLatLng = latLng(coord[0], coord[1]);

  useEffect(() => {
    // Fly to the specified location with the given zoom level
    console.log("CenterToMarkerLocationComponent useEffect(): " + coord);
    map.flyTo(coord, mapInitZoom);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coord, map]);

  return null;
}

function MapPageLayout({ locationData }) {
  // --- Map Marker state ---
  // Attributes: opendata_id, location, name
  const [mapMarkerContextState, setmapMarkerContextState] = useState({
    display_markers: {},
  });

  function addMarkerToMapFunction(item) {
    const newMarker = {
      opendata_id: item.attributes.opendata_id,
      coordinates: item.attributes.geojson.geometry.coordinates,
      name: item.attributes.geojson.location,
    };

    // Create a new object with the updated display_markers
    const updatedMapMarkerContextState = {
      display_markers: {
        ...mapMarkerContextState.display_markers,
        [item.attributes.opendata_id]: newMarker,
      },
    };

    // Update the state with the new object
    setmapMarkerContextState(updatedMapMarkerContextState);
    // console.log(updatedContextState);
  }

  const [mapCenterContextState, setMapCenterContextState] = useState({
    center: mapInitCenter,
  });

  function centerToMarkerLocation(item) {
    setMapCenterContextState({
      center: item.attributes.geojson.geometry.coordinates,
    });
    console.log("centerToMarkerLocation: " + item.attributes.geojson.geometry.coordinates);
  }

  return (
    // MapCenterContext
    <div className="bg-gray-950 flex justify-center items-center min-h-screen p-10">
      <div className="canvas flex">
        <div id="map" className="leaflet-container w-3/4 h-full">
          <MapCenterContext.Provider value={mapCenterContextState}>
            <MapMarkerContext.Provider value={mapMarkerContextState}>
              <BasicMap></BasicMap>
            </MapMarkerContext.Provider>
          </MapCenterContext.Provider>
        </div>

        {/* Vertical Line */}
        <div className="inline-block h-full mx-4 w-0.5 self-stretch bg-neutral-100 opacity-100 divider"></div>

        <div className="w-1/4 h-full">
          <UpdateMapCenterContextFunction.Provider
            value={centerToMarkerLocation}
          >
            <UpdateMapMarkerContextFunction.Provider
              value={addMarkerToMapFunction}
            >
              <FilterableList
                className="h-full"
                items={locationData}
              ></FilterableList>
            </UpdateMapMarkerContextFunction.Provider>
          </UpdateMapCenterContextFunction.Provider>
        </div>
      </div>
    </div>
  );
}

function BasicMap( {} ) {
  const mapCenterContext = useContext(MapCenterContext);
  const current_center = mapCenterContext.center;
  // console.log("BasicMap mapCenterContext: " + mapCenterContext);
  // console.log("BasicMap mapCenterContext.center: " + current_center);

  return (
    <MapContainer
      center={mapInitCenter} // Use something fixed for this, else map grey every time update this file
      zoom={mapInitZoom}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <BasicMapMarkers></BasicMapMarkers>
      {current_center ? (
        // Render the map markers and centering component when current_center is defined
        <>
          <BasicMapMarkers />
          <CenterToMarkerLocationComponent coord={current_center} />
        </>
      ) : (
        // Render a loading text or any other placeholder when current_center is undefined
        <div>Loading...</div>
      )}
    </MapContainer>
  );
}

function BasicMapMarkers( {} ) {
  // To extract map markers from global context:
  const mapInfo = useContext(MapMarkerContext);
  const map_markers = mapInfo.display_markers;
  // console.log("BasicMapMarkers");
  // console.log(map_markers);

  return (
    <>
      {Object.entries(map_markers).map(([opendata_id, marker]) => (
        <div key={opendata_id} className="leaflet-marker-container">
          <Marker
            className="leaflet-div-icon"
            position={marker.coordinates}
            icon={iconMarker}
          >
            <Popup>{marker.name}</Popup>
          </Marker>
        </div>
      ))}
    </>
  );
}

function FilterableList({ items }) {
  // console.log(items);
  const [query, setQuery] = useState("");

  var results = null;
  if (items) {
    results = filterItems(items.data, query);
  } else {
    return <div className="font-mono">Loading...</div>;
  }

  function handleChange(e) {
    setQuery(e.target.value);
  }

  return (
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
      {/* Horizontal Line */}
      <hr className="my-4 border-t-0 bg-neutral-100 opacity-100 divider horizontal-divider"/>
      <div className="mx-0 place-items-start overflow-y-auto flex-grow">
        <LocationList items={results} />
      </div>
    </div>
  );
}

// Template: https://transmit.tailwindui.com/
function LocationList({ items }) {
  const spliced_items = items.slice(0, 10);

  // const mapMarkerData = useContext(MapMarkerContext);
  const updateMapMarkerContextFunction = useContext(UpdateMapMarkerContextFunction);
  const updateMapCenterContextFunction = useContext(
    UpdateMapCenterContextFunction
  );

  return (
    <div className="basicmap-font">
      {spliced_items.map((item) => (
        <div
          key={item.attributes.opendata_id}
          className="mb-4 mr-1.5 flex flex-col items-start basicmap-item-box"
        >
          <h2
            id={item.attributes.geojson.location}
            className="text-lg font-bold text-slate-900 searchlist-location"
          >
            {item.attributes.geojson.location}
          </h2>
          <p className="mt-1 text-base leading-5 text-slate-700 searchlist-type">
            {item.attributes.geojson.type}
          </p>
          {/* <time
            dateTime="2022-02-24T00:00:00.000Z"
            className="font-mono text-sm leading-7 text-slate-500"
          >
            Last Updated: {item.attributes.date_updated}
          </time> */}
          <p className="mt-1 font-mono text-xs leading-7 text-slate-500 leading-normal searchlist-address">
            Address: {item.attributes.geojson.address}
          </p>
          <p className="font-mono text-xs leading-7 text-slate-500 leading-normal searchlist-address">
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
                More Information
              </span>
            </button>
            <span
              aria-hidden="true"
              className="text-sm font-bold text-slate-400"
            >
              /
            </span>
            <button
              type="button"
              className="flex items-center text-sm font-bold leading-6 text-pink-500 hover:text-pink-700 active:text-pink-900"
              aria-label={item.attributes.geojson.type}
            >
              <span
                className=""
                aria-hidden="true"
                onClick={function () {
                  updateMapMarkerContextFunction(item);
                  updateMapCenterContextFunction(item);
                }}
              >
                Show on Map
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

export default App;
