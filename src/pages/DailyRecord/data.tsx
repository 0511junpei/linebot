import { LineProps } from "@yamada-ui/charts";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  QueryFieldFilterConstraint,
  where,
} from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { db } from "../../firebase";
import { getFirstDayOfMonth, getLastDayOfMonth } from "./util";

export interface RecordDetailItem {
  docsId?: string;
  date: string;
  content?: string;
  createTimestamp?: Date;
  updateTimestamp?: Date;
  weatherInfo: WeatherInfomation;
  initialDataFlg?: boolean;
}

export interface WeatherInfomation {
  location: string;
  maxTemprature: number;
  minTemprature: number;
  weatherCode: number;
  hourlyTeperature: HourlyTemperature[];
}

export interface HourlyTemperature {
  time: String;
  temperature: number;
}

// TODO：ファイル作成場所を考える

// export const RECORDS: RecordDetailItem[] = getYearMonthRecord(new Date());

export const RECORDS: RecordDetailItem[] = [
  {
    docsId: "8",
    date: "2025/04/08",
    content: "テスト８",
    createTimestamp: new Date("2025/04/03 0:00"),
    updateTimestamp: new Date("2025/04/03 0:00"),
    weatherInfo: {
      location: "川越市",
      maxTemprature: 20,
      minTemprature: 10,
      weatherCode: 0,
      hourlyTeperature: [
        { time: "00:00", temperature: 10 },
        { time: "01:00", temperature: 11 },
        { time: "02:00", temperature: 12 },
        { time: "03:00", temperature: 13 },
        { time: "04:00", temperature: 14 },
        { time: "05:00", temperature: 16 },
        { time: "06:00", temperature: 17 },
        { time: "07:00", temperature: 17 },
        { time: "08:00", temperature: 18 },
        { time: "09:00", temperature: 18 },
        { time: "10:00", temperature: 19 },
        { time: "11:00", temperature: 19 },
        { time: "12:00", temperature: 19 },
        { time: "13:00", temperature: 20 },
        { time: "14:00", temperature: 20 },
        { time: "15:00", temperature: 20 },
        { time: "16:00", temperature: 19 },
        { time: "17:00", temperature: 18 },
        { time: "18:00", temperature: 17 },
        { time: "19:00", temperature: 16 },
        { time: "20:00", temperature: 15 },
        { time: "21:00", temperature: 14 },
        { time: "22:00", temperature: 13 },
        { time: "23:00", temperature: 12 },
      ],
    },
  },
];

export const DEFAULT_RECORD = RECORDS[0];

export const addDailyRecord = async (record: RecordDetailItem) => {
  const docRef = await addDoc(collection(db, "daily-record"), record);
};
