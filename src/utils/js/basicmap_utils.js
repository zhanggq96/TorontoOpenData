import L from 'leaflet';

export const iconMarker = new L.Icon({
  iconUrl: require("../icons/marker-icon-2x-purple.png"),
  // iconRetinaUrl: require("../icons/marker-icon-2x-purple.png"),

  // Note: Some of these need to have values. See below:
  // https://stackoverflow.com/a/66621241
  // But I'm not sure what to put for some.
  // changing popupAnchor from null to new L.Point(0, 0)
  // stopped one of the errors.
  iconSize: new L.Point(25, 41),
  shadowSize: null,
  iconAnchor: new L.Point(0, 0),
  popupAnchor: new L.Point(0, 0),
  shadowUrl: null,
  shadowAnchor: null,
  className: "leaflet-div-icon",
  transparent: true,
});