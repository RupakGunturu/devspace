import { Calendar as AntCalendar } from "antd";
import type { CalendarProps } from "antd";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import { cn } from "@/lib/utils";

export interface AntdCalendarProps {
  value?: Date | null;
  onChange?: (date: Date) => void;
  disabledDate?: (date: Dayjs) => boolean;
  className?: string;
  fullscreen?: boolean;
  headerRender?: CalendarProps<Dayjs>["headerRender"];
}

export function AntdCalendar({
  value,
  onChange,
  disabledDate,
  className,
  fullscreen = true,
  headerRender,
}: AntdCalendarProps) {
  const handleChange = (date: Dayjs) => {
    onChange?.(date.toDate());
  };

  const dayjsValue = value ? dayjs(value) : dayjs();

  return (
    <div
      className={cn(
        "[&_.ant-picker-calendar]:bg-transparent [&_.ant-picker-panel]:bg-transparent",
        "[&_.ant-picker-cell-in-view_.ant-picker-cell-inner]:transition-colors",
        "[&_.ant-picker-cell-selected_.ant-picker-cell-inner]:bg-[var(--color-primary)]",
        className,
      )}
    >
      <AntCalendar
        value={dayjsValue}
        onChange={handleChange}
        disabledDate={disabledDate}
        fullscreen={fullscreen}
        headerRender={headerRender}
      />
    </div>
  );
}

export interface AntdMiniCalendarProps {
  value?: Date | null;
  onSelect?: (date: Date) => void;
  disabledDate?: (date: Dayjs) => boolean;
  className?: string;
  markedDates?: Date[];
}

export function AntdMiniCalendar({
  value,
  onSelect,
  disabledDate,
  className,
  markedDates = [],
}: AntdMiniCalendarProps) {
  const handleSelect = (date: Dayjs) => {
    onSelect?.(date.toDate());
  };

  const dayjsValue = value ? dayjs(value) : dayjs();

  const isMarked = (date: Dayjs) => markedDates.some((d) => dayjs(d).isSame(date, "day"));

  return (
    <div
      className={cn(
        "[&_.ant-picker-calendar]:bg-transparent [&_.ant-picker-panel]:bg-transparent",
        "[&_.ant-picker-cell-inner]:relative",
        className,
      )}
    >
      <AntCalendar
        value={dayjsValue}
        onSelect={handleSelect}
        disabledDate={disabledDate}
        fullscreen={false}
        cellRender={(date, info) => {
          if (info.type === "date") {
            return (
              <div className="relative">
                <div>{info.originNode}</div>
                {isMarked(date) && (
                  <div className="absolute bottom-0 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[var(--color-primary)]" />
                )}
              </div>
            );
          }
          return info.originNode;
        }}
      />
    </div>
  );
}
