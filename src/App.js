import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "./App.css";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import { foods, filterItems, filterItems2 } from "./utils/searchbar_utils";

import { BrowserRouter, Route, Routes } from "react-router-dom";


function App() {
  const [locationData, setlocationData] = useState(null);

  useEffect(() => {
    fetch("http://35.183.91.143/api/washroomdata")
      .then((response) => response.json())
      .then((json) => setlocationData(json))
      .catch((error) => console.error(error));
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
        <div id="map" className="leaflet-container w-3/4">
          <BasicMap></BasicMap>
        </div>
        <div className="filterablelist w-1/4">
          <FilterableList items={locationData}></FilterableList>
        </div>
      </div>
    </div>
  );
}

function BasicMap( { locations, center } ) {
  return (
    <MapContainer
      center={[51.505, -0.09]}
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
      <Marker position={[51.505, -0.09]}>
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
    results = filterItems2(
      items,
      query
    );
  } else {
    return <div>Loading...</div>;
  }

  function handleChange(e) {
    setQuery(e.target.value);
  }

  return (
    <>
      <div className="bg-gray-600 bg-opacity-20 border border-gray-200 rounded-md">
        <SearchBar query={query} onChange={handleChange} />
      </div>
      <hr />
      <LocationList items={results} />
    </>
  );
}

function SearchBar({ query, onChange }) {
  return (
    <label>
      Search: <input value={query} onChange={onChange} />
    </label>
  );
}

function LocationList({ items }) {
  const spliced_items = items.slice(0, 5);
  return (
    <table>
      <tbody>
        {spliced_items.map((item) => (
          <tr key={item.opendata_id}>
            <td>{item.date_updated}</td>
            <td>{item.geojson.location}</td>
            {/* <td>{item.geojson.geometry}</td> */}
            <td>{item.geojson.geometry.coordinates[0]}</td>
            <td>{item.geojson.geometry.coordinates[1]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// Get data

// function getData() {
//   // https://levelup.gitconnected.com/3-ways-to-make-an-api-call-in-react-3734d025d92
//   const [data, setData] = useState(null);

//   useEffect(() => {
//     fetch("http://35.183.91.143/api/washroomdata/?format=json")
//       .then((response) => response.json())
//       .then((json) => setData(json))
//       .catch((error) => console.error(error));
//   }, []);

//   return (
//     <div>
//       {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : "Loading..."}
//     </div>
//   );
// }

// function dataDisplay() {
//   return (
//     <tr key={food.id}>
//       <td>{food.name}</td>
//       <td>{food.description}</td>
//     </tr>
//   );
// }

export default App;