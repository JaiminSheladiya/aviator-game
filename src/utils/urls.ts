import { webpORpng } from ".";
const format = webpORpng || "webp"; // fallback if undefined

// Use dummy URLs that won't break the app
const baseUrl =
  process.env.REACT_APP_ASSETS_IMAGE_URL || "https://via.placeholder.com/";
export const urls = [
  `${baseUrl}plane-anim.json`,
  `${baseUrl}parachute-red-anim.json`,
  `${baseUrl}parachute-gray-anim.json`,
  `${baseUrl}sun-like-bg.${format}`,
  `${baseUrl}propeller.${format}`,
  `${baseUrl}dot.${format}`,
];
