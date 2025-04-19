import { HourlyTemperature } from "./data";

export const getFirstDayOfMonth = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  return new Date(year, month, 1);
};

export const getLastDayOfMonth = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  return new Date(year, month + 1, 0);
};

export const getDatesOfMonth = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0); // 次の月の0日は当月の最終日

  const dates = [];
  let currentDate = new Date(firstDayOfMonth);

  while (currentDate <= lastDayOfMonth) {
    dates.push({ date: currentDate.toLocaleDateString() }); // Dateオブジェクトのコピーをpush
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};

export const convertYyyyMmDd = (date: Date) => {
  return date.toLocaleDateString("sv-SE");
};

export const transformHourlyArrayToHourlyObjectArray = (
  time: string[],
  temperature_2m: number[]
): HourlyTemperature[] => {
  const hourlyObjectArray: HourlyTemperature[] = [];
  for (let i = 0; i < time.length; i++) {
    hourlyObjectArray.push({
      time: new Date(time[i]).toLocaleTimeString("ja-JP", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      temperature: temperature_2m[i],
    });
  }
  return hourlyObjectArray;
};
