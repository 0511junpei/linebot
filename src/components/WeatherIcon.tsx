import React from "react";
import { AiFillThunderbolt } from "react-icons/ai";
import { IoRainy, IoSnowSharp } from "react-icons/io5";
import { MdCloud, MdFoggy, MdSunny } from "react-icons/md";

const Weather = Object.freeze({
  sunny: MdSunny({ color: "orange", size: "150" }),
  cloudy: MdCloud({ color: "gray", size: "150" }),
  foggy: MdFoggy({ color: "gray", size: "150" }),
  rainy: IoRainy({ color: "blue", size: "150" }),
  snowy: IoSnowSharp({ color: "gray", size: "150" }),
  thunderstorm: AiFillThunderbolt({ color: "yellow", size: "150" }),
});
const weatherMap: { [key: number]: React.ReactNode } = {
  0: Weather.sunny,
  1: Weather.sunny,
  2: Weather.cloudy,
  3: Weather.cloudy,
  45: Weather.foggy,
  48: Weather.foggy,
  51: Weather.rainy,
  53: Weather.rainy,
  55: Weather.rainy,
  56: Weather.rainy,
  57: Weather.rainy,
  61: Weather.rainy,
  63: Weather.rainy,
  65: Weather.rainy,
  66: Weather.rainy,
  67: Weather.rainy,
  71: Weather.snowy,
  73: Weather.snowy,
  75: Weather.snowy,
  77: Weather.snowy,
  80: Weather.rainy,
  81: Weather.rainy,
  82: Weather.rainy,
  85: Weather.snowy,
  86: Weather.snowy,
  95: Weather.thunderstorm,
  96: Weather.thunderstorm,
  99: Weather.thunderstorm,
};

export const WeatherIcon = (weatherCode: number) => {
  return <span>{weatherMap[weatherCode]}</span>;
};
