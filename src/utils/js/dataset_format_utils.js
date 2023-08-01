// Utilities for formatting convenient data formatting on the frontend.
// Reference data format from the backend API. This format is largely based 
// on the format the City of Toronto open data project uses.

// {
//     "data": [
//         {
//             "type": "WashroomData",
//             "id": "1",
//             "attributes":{
//                 "opendata_id":"1",
//                 "geojson":{
//                     "_id": 1,
//                     "id": 774,
//                     "asset_id": 80165,
//                     "location": "Wenderly Park",
//                     "alternative_name": "Wenderly Park Baseball Diamond Bottle Filling Station",
//                     "type": "Bottle Filling Station",
//                     "accessible": "",
//                     "hours": "None",
//                     "location_details": "Located north of the baseball diamond along the pathway.",
//                     "url":"https://www.toronto.ca/data/parks/prd/facilities/complex/774/index.html",
//                     "address": "89 Wenderly Dr",
//                     "geometry": {
//                         "type": "Point",
//                         "coordinates": [
//                             43.7119805089016,
//                             -79.4461230209045
//                         ]
//                     }
//                 },
//                 "date_updated":"14/07/2023 10:02:17"
//             }
//         },
//     ]
// }

export function itemFormatter(item) {
  // console.log("itemFormatter: " + item);
  // Extract a few display elements from the API
  // This should never be passed around: only as a preprocessing
  // step before displaying information
  if (item === null || item === undefined) {
    return {
      name: "Location Name",
      type: "Facility Type",
      address: "Address",
      coordinates: "Coordinates",
      location_details: "Location Details",
      url: "URL",
      date_updated: "Date Updated",
    };
  }
  // console.log("itemFormatter: " + item.attributes.geojson.location);
    
  const reformatted = {
    name: item.attributes.geojson.location,
    type: item.attributes.geojson.type,
    address: item.attributes.geojson.address,
    coordinates: item.attributes.geojson.geometry.coordinates,
    location_details: item.attributes.geojson.location_details,
    url: item.attributes.geojson.url,
    date_updated: item.attributes.date_updated,
  };

  return reformatted;
}

export function coordFormatter(coord) {
  if (coord === null || coord === undefined || !Array.isArray(coord)) {
    return "Coordinates";
  } else if (coord.some((value) => typeof value !== 'number')) {
    return "Unknown format";
  }
  console.log("coord.type: " + typeof coord);
  const reformatted = coord.map((value) => value.toFixed(4)).join(', ')

  return reformatted;
}