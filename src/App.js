import React, { useState, useEffect, createContext, useContext } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { itemFormatter, coordFormatter } from "./utils/js/dataset_format_utils";
import {
  filterSearchTerm,
  filterFacilityType,
  LocationSearchBar,
  FacilityFilterSearchBar,
  PointIcon,
  ExpandInfo,
} from "./utils/js/searchbar_utils";
import {
  iconMarker,
  mapInitZoom,
  mapInitCenter,
} from "./utils/js/leaflet_utils";

import "leaflet/dist/leaflet.css";
import "./App.css";
import "./utils/css/basicmap_customization.css";

// --- Map state data ---
const MapMarkerContext = createContext();
const UpdateMapMarkerContextFunction = createContext();
const MapCenterContext = createContext();
const UpdateMapCenterContextFunction = createContext();

// --- List state data ---
const SearchQuery = createContext();
const UpdateSearchQuery = createContext();

// --- Infobar state data ---
const InfoBarContext = createContext();
const UpdateInfoBarContext = createContext();

// Set input through infobar, applied to searchbar to filter by type.
const FacilityFilterForSearchlistContext = createContext();
const UpdateFacilityFilterForSearchlistContext = createContext();

const defaultNumLocations = 10;
const defaultNumLocationsIncrement = 5;

// const SearchlistNumlocationsContext = createContext();
// const UpdateSearchlistNumlocationsContextFunction = createContext();


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
      .then((json) => setlocationData(json.data))
      .catch((error) => {
        console.error(error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!locationData) {
    return <div className="font-mono">Loading data...</div>
  }
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
  // const coord_ = Object.assign({}, coord);

  useEffect(() => {
    // Fly to the specified location with the given zoom level
    console.log("CenterToMarkerLocationComponent useEffect(): " + coord);
    map.flyTo(coord, mapInitZoom);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coord, map]);

  return null;
}

function MapPageLayout({ locationData }) {
  // --- Map marker state ---
  // Attributes: opendata_id, location, name
  const [mapMarkerContextState, setmapMarkerContextState] = useState({
    display_items: {},
  });

  function addMarkerToMap(item) {
    // Create a new object with the updated display_markers
    const updatedMapMarkerContextState = {
      display_items: {
        ...mapMarkerContextState.display_items,
        [item.attributes.opendata_id]: item,
      },
    };

    // Update the state with the new object
    setmapMarkerContextState(updatedMapMarkerContextState);
  }

  function setMarkersTo(items, filterquery, reset) {
    // const updatedMapMarkerContextState = {
    //   display_items: filterquery === "" ? locationData : filterFacilityType(locationData, filterquery),
    // };
    let updatedMapMarkerContextState = null;
    switch(reset) {
      case "showall":
        updatedMapMarkerContextState = { display_items: locationData };
        break;
      case "hideall":
        updatedMapMarkerContextState = { display_items: {} };
        break;
      default: updatedMapMarkerContextState = {
        // If press "show all of type" with empty query, display everything.
        display_items: filterquery === "" ? locationData : filterFacilityType(locationData, filterquery)}
    }
    setmapMarkerContextState(updatedMapMarkerContextState);
  }

  const mapMarkerFunctions = {
    addMarkerToMapFunction: addMarkerToMap,
    setMarkersToFunction: setMarkersTo,
  };

  const [mapCenterContextState, setMapCenterContextState] = useState({
    center: mapInitCenter,
  });

  function centerToMarkerLocation(item) {
    console.log(
      "centerToMarkerLocation: " + item.attributes.geojson.geometry.coordinates
    );
    setMapCenterContextState({
      center: item.attributes.geojson.geometry.coordinates,
    });
  }
  // --- End map marker state ---
  //
  // --- Begin search query state ---
  const [searchQueryState, setSearchQueryState] = useState({
    searchQuery: "",
    numListItems: defaultNumLocations,
    increment: defaultNumLocationsIncrement,
  });
  // --- End search query state ---
  //
  // --- Begin infobar state ---
  const [infobarState, setInfobarState] = useState({
    item: itemFormatter(null),
  });

  function setInfobarTo(item) {
    const formatted_item = itemFormatter(item);
    setInfobarState({
      item: formatted_item,
    });
  }

  const [
    facilityFilterForSearchlistState,
    setFacilityFilterForSearchlistState,
  ] = useState({
    filterquery: "",
  });

  function updateFacilityFilterSearchbar(e) {
    // setFacilityFilterForSearchlistState(e.target.value);
    setFacilityFilterForSearchlistState({filterquery: e.target.value});
  }
  // --- End infobar state ---

  return (
    // MapCenterContext
    <div className="bg-gray-950 flex justify-center items-center min-h-screen p-25">
      <UpdateInfoBarContext.Provider value={setInfobarTo}>
        <UpdateSearchQuery.Provider value={setSearchQueryState}>
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
            <UpdateMapCenterContextFunction.Provider
              value={centerToMarkerLocation}
            >
              <UpdateMapMarkerContextFunction.Provider
                value={mapMarkerFunctions}
              >
                <FacilityFilterForSearchlistContext.Provider
                  value={facilityFilterForSearchlistState}
                >
                  <SearchQuery.Provider value={searchQueryState}>
                    <div id="searchCol" className="w-1/4 h-full">
                      <FilterableList
                        className="h-full"
                        items={locationData}
                      ></FilterableList>
                    </div>
                  </SearchQuery.Provider>
                  <div className="inline-block h-full mx-4 w-0.5 self-stretch bg-neutral-100 opacity-100 divider"></div>
                  <InfoBarContext.Provider value={infobarState}>
                    <UpdateFacilityFilterForSearchlistContext.Provider
                      value={updateFacilityFilterSearchbar}
                    >
                      <div id="infoCol" className="w-1/4 h-full">
                        <InformationList></InformationList>
                      </div>
                    </UpdateFacilityFilterForSearchlistContext.Provider>
                  </InfoBarContext.Provider>
                </FacilityFilterForSearchlistContext.Provider>
              </UpdateMapMarkerContextFunction.Provider>
            </UpdateMapCenterContextFunction.Provider>
          </div>
        </UpdateSearchQuery.Provider>
      </UpdateInfoBarContext.Provider>
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
      // attributionControl={false}
      // position="bottomleft"
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
        <div className="loading-text">Loading...</div>
      )}
    </MapContainer>
  );
}

function BasicMapMarkers( {} ) {
  // To extract map markers from global context:
  const mapInfo = useContext(MapMarkerContext);
  const map_items = mapInfo.display_items;
  
  const updateInfoBarTo = useContext(UpdateInfoBarContext);

  return (
    <>
      {Object.entries(map_items).map(([opendata_id, item]) => (
        <div key={opendata_id} className="leaflet-marker-container">
          <Marker
            className="leaflet-div-icon"
            position={itemFormatter(item).coordinates}
            icon={iconMarker}
          >
            <Popup>
              <p className="my-0">Location: {itemFormatter(item).name}</p>
              {/* <p className="my-0">More Information</p> */}
              <ExpandInfo
                item={item}
                text="More Information"
                onclick={function () {updateInfoBarTo(item)}} // TODO
                customClass="text-xs"
              ></ExpandInfo>
            </Popup>
          </Marker>
        </div>
      ))}
    </>
  );
}

function FilterableList({ items }) {
  
  // Filter by facility type
  const facilityFilterForSearchlistContext = useContext(FacilityFilterForSearchlistContext);

  // const [query, setQuery] = useState("");
  // const [numListItems, setNumListItems] = useState(defaultNumLocations);
  const [loadedAllListItems, setLoadedAllListItems] = useState(false);

  const searchQuery = useContext(SearchQuery);
  const updateSearchQuery = useContext(UpdateSearchQuery);

  var results = null;
  if (items) {
    // results = filterSearchTerm(items.data, query);
    // console.log(results.slice(0, 10));
    // console.log(items.data.slice(0, 10));
    results = filterFacilityType(
      // filterSearchTerm(items, query),
      filterSearchTerm(items, searchQuery.searchQuery),
      facilityFilterForSearchlistContext.filterquery
    );
    console.log(
      "FilterableList [filterquery]: " +
        facilityFilterForSearchlistContext.filterquery
    );
  } else {
    return <div className="loading-text">Loading...</div>;
  }

  function extendLocationlistResults() {
    updateSearchQuery({
      searchQuery: searchQuery.searchQuery,
      numListItems: searchQuery.numListItems + searchQuery.increment,
      increment: searchQuery.increment,
    });
    // setNumListItems(numListItems + defaultNumLocationsIncrement);
    // setLoadedAllListItems(numListItems >= results.length);
    setLoadedAllListItems(searchQuery.numListItems >= results.length);
    console.log("extendLocationlistResults: " + searchQuery.numListItems);
  }

  function searchbarChange(e) {
    updateSearchQuery({
      searchQuery: e.target.value,
      numListItems: defaultNumLocations,
      increment: searchQuery.increment,
    });
    // setQuery(e.target.value);
    // setNumListItems(defaultNumLocations);
    setLoadedAllListItems(false); // Workaround.
    // Current problem is that calling results.length gives the length of the
    // Previous query, rather than the current one. e.g.
    // Enter c, get 500. Enter cl, get ~80. Enter clo, get ~12.
    // Remove o to go back to cl, get 4. When 4 is the number of
    // queries for clo.

    // The workaround just always displays "load more..." and if clicked
    // when nothing left, displays "all loaded" only then,
    // rather than preemptively.
  }

  // function filterTypeBarChange(e) {
  //   setQuery(e.target.value);
  //   setNumListItems(defaultNumLocations);
  //   setLoadedAllListItems(false); // Workaround.
  // }

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
      <LocationSearchBar
        className="w-full"
        // query={query}
        query={searchQuery.searchQuery}
        onChange={searchbarChange}
      />
      {/* Horizontal Line */}
      <hr className="my-4 border-t-0 bg-neutral-100 opacity-100 divider horizontal-divider" />
      <div className="mx-0 place-items-start overflow-y-auto no-scrollbar">
        <LocationList items={results} numItems={searchQuery.numListItems} />
        {results.length > 0 ? (
          <LoadAdditionalButton
            extendLocationlistResults={extendLocationlistResults}
            loadedAll={loadedAllListItems}
          ></LoadAdditionalButton>
        ) : (
          <div className="loading-text text-center">No results.</div>
        )}
      </div>
    </div>
  );
}

// Template: https://transmit.tailwindui.com/
function LocationList({ items, numItems }) {
  const spliced_items = items.slice(0, numItems);

  const updateMapMarkerContext = useContext(
    UpdateMapMarkerContextFunction
  );
  const updateMapMarkerContextFunction = updateMapMarkerContext.addMarkerToMapFunction;

  const updateMapCenterContextFunction = useContext(
    UpdateMapCenterContextFunction
  );
  const updateInfoBarContext = useContext(
    UpdateInfoBarContext
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
              onClick={function(){
                updateInfoBarContext(item);
              }}
            >
              <PointIcon></PointIcon>
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

function LoadAdditionalButton({ extendLocationlistResults, loadedAll }) {
  return (
    <div
      className="loading-text text-center"
      onClick={function () {
        // updateMapMarkerContextFunction(item);
        // updateMapCenterContextFunction(item);
        extendLocationlistResults();
      }}
    >
      {loadedAll ? <p>Reached end of list.</p> : <p>Load more...</p>}
    </div>
  );
}

function GenericButton({ text, onclick, customClass }) {
  return (
    <button
      type="submit"
      className={`p-0 basicmap-font text-sm font-medium text-white bg-pink-500 rounded-lg border border-pink-700 hover:bg-pink-800 focus:ring-4 focus:outline-none focus:ring-pink-300 dark:bg-pink-600 dark:hover:bg-pink-700 dark:focus:ring-pink-800 h-10 mb-2 button ${customClass}`}
      onClick={
        onclick instanceof Function
          ? function () {
              onclick();
            }
          : function () {}
      }
    >
      {text}
    </button>
  );
}

function InformationList( {} ) {
  // const facilityInfoBarItem = useContext(FacilityInfoBarItemContext);
  const mapMarkerFunctions = useContext(UpdateMapMarkerContextFunction);
  const updateFacilityFilterForSearchlistFunction = useContext(
    UpdateFacilityFilterForSearchlistContext
  );
  const facilityFilterForSearchlist = useContext(
    FacilityFilterForSearchlistContext
  );

  const showAllMapMarkers = function() {
    mapMarkerFunctions.setMarkersToFunction(null, "", "showall");
  }
  const hideAllMapMarkers = function() {
    mapMarkerFunctions.setMarkersToFunction(null, "", "hideall");
  }
  const showFilteredMapMarkers = function() {
    mapMarkerFunctions.setMarkersToFunction(
      null,
      facilityFilterForSearchlist.filterquery,
      ""
    );
  }

  return (
    <div className="flex-wrap w-full">
      <GenericButton
        customClass="mx-2 w-[calc(50%-8px)] ml-0"
        text="Show All"
        onclick={showAllMapMarkers}
      ></GenericButton>
      <GenericButton
        customClass="mx-2 w-[calc(50%-8px)] mr-0"
        text="Hide All"
        onclick={hideAllMapMarkers}
      ></GenericButton>
      <GenericButton
        customClass="mx-2 w-[calc(100%)] ml-0 mt-2"
        text="Show All of Type on Map:"
        onclick={showFilteredMapMarkers}
      ></GenericButton>
      <FacilityFilterSearchBar
        onChange={updateFacilityFilterForSearchlistFunction}
        query={facilityFilterForSearchlist.filterquery}
      ></FacilityFilterSearchBar>
      {/* <FilterBar></FilterBar> */}
      <hr className="my-4 border-t-0 bg-neutral-100 opacity-100 divider horizontal-divider" />
      <FacilityInfoBar></FacilityInfoBar>
    </div>
  );
}

function FacilityInfoBar({ item }) {
  // Built-in handling of null or undefined objects:
  // will default to displaying generic terms e.g. "Location"
  // const display_item = itemFormatter(item);
  const infoBarContext = useContext(InfoBarContext);
  const display_item = infoBarContext.item;

  return (
    <div className="mt-2 basicmap-font overflow-y-auto break-all">
      <div className="w-full p-2 rounded-t-xl infobar-wrapper">
        <h1 className="infobar-header">Facility Information</h1>
      </div>

      <div className="infobar-wrapper p-2 border-t-0">
        <div className="relative">
          <div
            key="sample"
            className="mb-4 mr-1.5 flex flex-col items-start basicmap-item-box"
          >
            <h2
              id="sample"
              className="text-lg font-bold text-slate-900 searchlist-location"
            >
              {display_item.name}
            </h2>
            <p className="mt-1 text-base leading-5 text-slate-700 searchlist-type">
              {display_item.type}
            </p>
            <p className="mt-1 font-mono text-xs leading-7 text-slate-500 leading-normal searchlist-address">
              Address: {display_item.address}
            </p>
            <p className="mt-1 font-mono text-xs leading-7 text-slate-500 leading-normal searchlist-coordinates">
              Coordinates: {coordFormatter(display_item.coordinates)}
            </p>
            <p className="mt-1 font-mono text-xs leading-7 text-slate-500 leading-normal searchlist-details">
              {display_item.location_details}
            </p>
            <p className="mt-1 font-mono text-xs leading-7 text-slate-500 leading-normal searchlist-url">
              Link:{" "}
              <a href={display_item.url} target="_blank">
                {display_item.url}
              </a>
            </p>
            <time
              dateTime="2022-02-24T00:00:00.000Z"
              className="font-mono text-sm leading-7 text-slate-500 searchlist-updated"
            >
              Last Updated: {display_item.date_updated}
            </time>
          </div>
        </div>
      </div>
      <div className="code-syntax-wrapper"></div>
    </div>
  );
}

export default App;
