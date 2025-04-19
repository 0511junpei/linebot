import React, { useEffect, useRef, useState } from "react";
import {
  memo,
  noop,
  Resizable,
  ResizableItem,
  ResizableTrigger,
  Separator,
  useBoolean,
  VStack,
} from "@yamada-ui/react";
import { RecordList } from "./RecordList";
import { RecordDetail } from "./RecordDetail";
import {
  DEFAULT_RECORD,
  RECORDS,
  RecordDetailItem,
  addDailyRecord,
} from "./data";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { convertYyyyMmDd, getFirstDayOfMonth, getLastDayOfMonth } from "./util";
import { db } from "../../firebase";

const DEFAULT_DAILY_RECORD_DATA: RecordDetailItem = {
  docsId: "",
  date: "",
  weatherInfo: {
    weatherCode: -1,
    location: "",
    maxTemprature: 0,
    minTemprature: 0,
    hourlyTeperature: [
      {
        temperature: 0,
        time: "0:00",
      },
    ],
  },
  initialDataFlg: true,
};

export const DailyRecord = memo(() => {
  const [isCollapse, { off, on }] = useBoolean();
  const setRecordRef = useRef<(record: RecordDetailItem) => void>(noop);
  const [dailyRecords, setDailyRecords] = useState<RecordDetailItem[]>([]);
  // const [defaultDailyRecord, setDefaultDailyRecord] =
  //   useState<RecordDetailItem>(DEFAULT_DAILY_RECORD_DATA);
  const [parentYearMonth, setParentYearMonth] = useState<Date>();

  const handleChildValueChanged = (value?: Date) => {
    setParentYearMonth(value);
  };

  const getYearMonthRecords = async (yearMonth: Date) => {
    // TODO：日付をハイフンで検索かけるの良くない
    const q = query(
      collection(db, "daily-record"),
      where("date", ">=", convertYyyyMmDd(getFirstDayOfMonth(yearMonth))),
      where("date", "<=", convertYyyyMmDd(getLastDayOfMonth(yearMonth))),
      orderBy("date")
    );
    const records: RecordDetailItem[] = [];
    onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const record: RecordDetailItem = {
          docsId: doc.id,
          date: data.date,
          weatherInfo: {
            weatherCode: data.weatherInfo.weatherCode,
            location: data.weatherInfo.location,
            maxTemprature: data.weatherInfo.maxTemprature,
            minTemprature: data.weatherInfo.minTemprature,
            hourlyTeperature: data.weatherInfo.hourlyTeperature,
          },
        };
        records.push(record);
      });
    });
    return records;
  };

  useEffect(() => {
    const main = async () => {
      const records = await getYearMonthRecords(
        parentYearMonth ? parentYearMonth : new Date()
      );
      setDailyRecords(records);
      // setDefaultDailyRecord(records ? records[0] : DEFAULT_DAILY_RECORD_DATA);
    };
    main();
  }, []);

  // TODO：ファイル分ける
  // const weatherClient = axios.create({
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  // });

  // const openMeteoApiBase = "https://api.open-meteo.com/v1/forecast";
  // // TODO：一旦コメント
  // useEffect(() => {
  //   const createRecordDetailItem = (data: any) => {
  //     const dailyWeatherInfo: WeatherInfomation = {
  //       weatherCode: data.daily.weather_code[0],
  //       location: "川越市",
  //       maxTemprature: data.daily.temperature_2m_max[0],
  //       minTemprature: data.daily.temperature_2m_min[0],
  //       hourlyTeperature: transformHourlyArrayToHourlyObjectArray(
  //         data.hourly.time,
  //         data.hourly.temperature_2m
  //       ),
  //     };

  //     const now = new Date();
  //     const recordDetailItem: RecordDetailItem = {
  //       date: data.daily.time[0],
  //       createTimestamp: now,
  //       updateTimestamp: now,
  //       weatherInfo: dailyWeatherInfo,
  //     };
  //     return recordDetailItem;
  //   };
  //   const getWeatherInfo = async () => {
  //     const response = await weatherClient.get(
  //       `${openMeteoApiBase}?latitude=35.9086&longitude=139.4853&daily=weather_code,temperature_2m_max,temperature_2m_min&hourly=temperature_2m&forecast_days=1`
  //     );
  //     return response.data;
  //   };

  //   const main = async () => {
  //     const weatherData = await getWeatherInfo();
  //     console.log(weatherData);
  //     if (!weatherData) {
  //       console.log("データなし");
  //       return;
  //     }
  //     const recordDetailItem = createRecordDetailItem(weatherData);
  //     addDailyRecord(recordDetailItem);
  //   };
  //   main();
  // }, []);

  return (
    <Resizable as="section" h={{ base: "5xl", sm: "6xl" }}>
      <ResizableItem>
        <Resizable display={{ base: "block", lg: "none" }}>
          <ResizableItem
            collapsedSize={4}
            collapsible
            defaultSize={20}
            maxSize={20}
            // maxW={{ base: "64", xl: "14" }}
            minSize={15}
            minW="14"
            onCollapse={on}
            onExpand={off}
          >
            <RecordList
              defaultRecord={DEFAULT_RECORD}
              records={dailyRecords}
              setRecordRef={setRecordRef}
              onYearMonthValueChange={handleChildValueChanged}
            />
          </ResizableItem>

          <ResizableTrigger />

          <ResizableItem defaultSize={60} maxSize={70} minSize={50}>
            <RecordDetail
              defaultRecord={DEFAULT_RECORD}
              setRecordRef={setRecordRef}
            />
          </ResizableItem>
        </Resizable>
      </ResizableItem>
    </Resizable>
  );
});
DailyRecord.displayName = "DailyRecord";
