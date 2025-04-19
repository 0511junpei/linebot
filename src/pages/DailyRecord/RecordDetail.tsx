import {
  assignRef,
  Box,
  HStack,
  memo,
  RadioCard,
  RadioCardGroup,
  RadioCardLabel,
  Separator,
  Spacer,
  StackProps,
  Text,
  Textarea,
  VStack,
} from "@yamada-ui/react";
import { FC, MutableRefObject, useEffect, useMemo, useState } from "react";
import { RecordDetailItem, WeatherInfomation } from "./data";
import { Header } from "./Header";
import { LineChart, LineProps } from "@yamada-ui/charts";
import { SensibleTemperature } from "../../constants/SensibleTemperature";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../firebase";
import { WeatherIcon } from "../../components/WeatherIcon";
import axios from "axios";
import { transformHourlyArrayToHourlyObjectArray } from "./util";

interface RecordDetailProps extends StackProps {
  defaultRecord: RecordDetailItem;
  setRecordRef: MutableRefObject<(record: RecordDetailItem) => void>;
}

export const RecordDetail: FC<RecordDetailProps> = ({
  defaultRecord,
  setRecordRef,
  ...rest
}) => {
  const [
    {
      date,
      content,
      weatherInfo: {
        location,
        maxTemprature,
        minTemprature,
        weatherCode,
        hourlyTeperature,
      },
    },
    setRecord,
  ] = useState<RecordDetailItem>(defaultRecord);

  const [sensibleTemperature, setSensibleTemperature] = useState(
    SensibleTemperature.NONE
  );
  const data = useMemo(() => [...hourlyTeperature], [hourlyTeperature]);

  const series: LineProps[] = useMemo(
    () => [{ dataKey: "temperature", color: "green.500" }],
    []
  );

  assignRef(setRecordRef, setRecord);
  return (
    <VStack h="full" {...rest}>
      <VStack>
        <VStack>
          <Text as="span">本日の体感温度は？</Text>
          <RadioCardGroup
            w="fit-content"
            withIcon={false}
            onChange={(value: SensibleTemperature) =>
              setSensibleTemperature(value)
            }
          >
            <RadioCard value={SensibleTemperature.COLD}>
              <RadioCardLabel>
                <HStack gap="sm">
                  <Text>🥶</Text>
                </HStack>
              </RadioCardLabel>
            </RadioCard>

            <RadioCard value={SensibleTemperature.NORMAL}>
              <HStack gap="sm">
                <Text>😐</Text>
              </HStack>
            </RadioCard>

            <RadioCard value={SensibleTemperature.HOT}>
              <RadioCardLabel>
                <HStack gap="sm">
                  <Text>🥵</Text>
                </HStack>
              </RadioCardLabel>
            </RadioCard>
          </RadioCardGroup>
        </VStack>
        {/* <VStack align="center">
          <Textarea autosize maxRows={6} minRows={3} />
        </VStack> */}
        <Spacer display={{ base: "block", sm: "none" }} />
      </VStack>
      <VStack>
        <HStack align="start" p="md">
          <Text as="span">{location}</Text>
          <Spacer display={{ base: "block", sm: "none" }} />
          <HStack
            align="start"
            direction={{ base: "row", sm: "column" }}
            gap="xs"
          >
            <VStack gap="xs">
              <Text as="span">{date}</Text>
              <Text as="span">{weatherCode}</Text>
            </VStack>
          </HStack>
        </HStack>
        <Spacer display={{ base: "block", sm: "none" }} />
      </VStack>
      <VStack>
        <VStack align="center">
          <Text as="span">{WeatherIcon(weatherCode)}</Text>
          <HStack>
            <Text as="span" color="red">
              {maxTemprature}℃
            </Text>
            <Text as="span">／</Text>
            <Text as="span" color="blue">
              {minTemprature}℃
            </Text>
          </HStack>
        </VStack>
        <Spacer display={{ base: "block", sm: "none" }} />
      </VStack>
      <VStack separator={<Separator />}>
        <VStack align="center">
          <LineChart data={data} series={series} dataKey="time" size="sm" />
        </VStack>
        <Spacer display={{ base: "block", sm: "none" }} />
      </VStack>
    </VStack>
  );
};
