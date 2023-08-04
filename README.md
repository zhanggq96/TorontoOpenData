# Toronto Open Data Frontend

This project uses a React frontend and Django backend to visualize geographical data provided by the city of Toronto. The backend serves the API for the frontend at the endpoint /api/. <br>

Works on Chrome and Firefox desktop.

- Website Link: [http://35.183.91.143/](http://35.183.91.143/) (currently no domain name)
- Frontend Repository: [https://github.com/zhanggq96/TorontoOpenData](https://github.com/zhanggq96/TorontoOpenData)
- Backend Repository: [https://github.com/zhanggq96/TorontoOpenDataBackend](https://github.com/zhanggq96/TorontoOpenDataBackend)
- Toronto Open Data Site: [https://www.toronto.ca/city-government/data-research-maps/open-data/](https://www.toronto.ca/city-government/data-research-maps/open-data/)

## Information

The site displays an interactive map using Leaflet, which is integrated with react through react-leaflet, and Tailwind is used for CSS styling. The particular style was based off the [transmit](https://tailwindcss.com/showcase/transmit) template, adjusted to dark mode.

Currently, only the [washroom facilities](https://open.toronto.ca/dataset/washroom-facilities/) dataset is supported.

## Frontend Dependencies

<ul>
  <li>ReactJS</li>
  <li>React Leaflet</li>
  <li>Tailwind CSS</li>
  <li>React Router</li>
</ul> 