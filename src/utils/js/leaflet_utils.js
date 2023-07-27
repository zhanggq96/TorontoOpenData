import L from 'leaflet';

export const latLng = L.latLng;

export const mapInitZoom = 13;
export const mapInitCenter = [43.6226 + 0.05, -79.45 + 0.05];
export const leaflet_marker_length = 25.0;
export const leaflet_marker_height = 41.0;
export const iconMarker = new L.Icon({
  iconUrl: require("../icons/marker-icon-2x-purple.png"),
  // iconRetinaUrl: require("../icons/marker-icon-2x-purple.png"),

  // Note: Some of these need to have values. See below:
  // https://stackoverflow.com/a/66621241
  // But I'm not sure what to put for some.
  // changing popupAnchor from null to new L.Point(0, 0)
  // stopped one of the errors.
  iconSize: new L.Point(leaflet_marker_length, leaflet_marker_height),
  shadowSize: null,
  // Proper iconAnchor value to center bottom middle:
  // https://gis.stackexchange.com/questions/352480/why-my-markers-move-when-i-resize-my-map-on-leaflet
  iconAnchor: new L.Point(leaflet_marker_length / 2.0, leaflet_marker_height),
  popupAnchor: new L.Point(0, 0),
  shadowUrl: null,
  shadowAnchor: null,
  className: "leaflet-div-icon",
  transparent: true,
});