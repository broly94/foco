import axios from 'axios';

export const GeoCodeAxios = axios.create({
  baseURL: 'https://maps.googleapis.com/maps/api/geocode/',
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': 'https://maps.googleapis.com',
  },
});
