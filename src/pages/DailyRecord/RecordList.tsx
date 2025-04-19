import type { CardProps, StackProps } from "@yamada-ui/react";
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  handlerAll,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  memo,
  Spacer,
  useBoolean,
  VStack,
} from "@yamada-ui/react";
import { SearchIcon } from "@yamada-ui/lucide";
import { DatePicker, MonthPicker } from "@yamada-ui/calendar";
import {
  convertYyyyMmDd,
  transformHourlyArrayToHourlyObjectArray,
} from "./util";
import { FC, MutableRefObject, useEffect, useRef, useState } from "react";
import { Header } from "./Header";
import { NotebookPenIcon } from "@yamada-ui/lucide";
import { addDailyRecord, RecordDetailItem, WeatherInfomation } from "./data";
import axios from "axios";

interface RecordListProps extends StackProps {
  defaultRecord: RecordDetailItem;
  records: RecordDetailItem[];
  setRecordRef: MutableRefObject<(record: RecordDetailItem) => void>;
  onYearMonthValueChange: (value?: Date) => void;
}

export const RecordList: FC<RecordListProps> = memo(
  ({
    defaultRecord,
    records,
    setRecordRef,
    onYearMonthValueChange,
    ...rest
  }) => {
    const [childYearMonth, setChildYearMonth] = useState<Date>();
    const resetMapRef = useRef<Map<string, () => void>>(new Map());
    const handleChange = (value?: Date) => {
      setChildYearMonth(value);
      onYearMonthValueChange(value);
    };
    return (
      <VStack gap="0" h="full" {...rest}>
        <Header>
          <NotebookPenIcon />
          <Heading as="h4" size="md">
            記録
          </Heading>
        </Header>
        <VStack as="nav" flex="0" gap="0">
          <Box p="xs">
            <InputGroup>
              <MonthPicker
                placeholder="Search"
                onChange={(date) => {
                  handleChange(date);
                }}
              />
            </InputGroup>
          </Box>
        </VStack>
        <VStack
          as="ul"
          flexBasis="0"
          flexGrow="1"
          gap="xs"
          overflowY="scroll"
          pb="xs"
          px="xs"
        >
          {records.map((record) => {
            const { date, docsId } = record;
            const defaultIsSelected = date === convertYyyyMmDd(new Date());
            return (
              <Box as="li" key={docsId}>
                <RecordListItem
                  defaultIsSelected={defaultIsSelected}
                  resetMapRef={resetMapRef}
                  onClick={() => setRecordRef.current(record)}
                  {...record}
                />
              </Box>
            );
          })}
        </VStack>
      </VStack>
    );
  }
);

RecordList.displayName = "RecordList";

interface RecordListItemProp
  extends RecordDetailItem,
    Omit<CardProps, "content" | "title"> {
  resetMapRef: MutableRefObject<Map<string, () => void>>;
  defaultIsSelected?: boolean;
}

const RecordListItem: FC<RecordListItemProp> = memo(
  ({
    date,
    content,
    resetMapRef,
    onClick,
    defaultIsSelected,
    weatherInfo,
    ...rest
  }) => {
    const [isSelect, { off, on }] = useBoolean(defaultIsSelected);
    resetMapRef.current.set(date, off);

    const reset = () => {
      for (const [resetId, func] of resetMapRef.current.entries()) {
        if (date !== resetId) {
          func();
        }
      }
    };

    return (
      <Card
        as="article"
        variant="outline"
        bg={isSelect ? ["blackAlpha.50", "whiteAlpha.50"] : "transparent"}
        cursor="pointer"
        onClick={handlerAll(onClick, on, reset)}
        {...rest}
      >
        <CardBody gap="xs" pt="xs">
          <Heading as="h6" size="xs" fontWeight="normal">
            {date}
          </Heading>
        </CardBody>
      </Card>
    );
  }
);
