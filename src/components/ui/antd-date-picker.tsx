import { DatePicker as AntDatePicker } from "antd";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import { cn } from "@/lib/utils";

export interface AntdDatePickerProps {
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  format?: string;
  allowClear?: boolean;
  disabledDate?: (date: Dayjs) => boolean;
}

export function AntdDatePicker({
  value,
  onChange,
  placeholder = "Select date",
  disabled = false,
  className,
  format = "YYYY-MM-DD",
  allowClear = true,
  disabledDate,
}: AntdDatePickerProps) {
  const handleChange = (date: Dayjs | null) => {
    onChange?.(date ? date.toDate() : null);
  };

  const dayjsValue = value ? dayjs(value) : null;

  return (
    <AntDatePicker
      value={dayjsValue}
      onChange={handleChange}
      placeholder={placeholder}
      disabled={disabled}
      format={format}
      allowClear={allowClear}
      disabledDate={disabledDate}
      className={cn("w-full", className)}
      size="middle"
    />
  );
}

export interface AntdRangePickerProps {
  value?: [Date | null, Date | null] | null;
  onChange?: (dates: [Date | null, Date | null] | null) => void;
  placeholder?: [string, string];
  disabled?: boolean;
  className?: string;
  format?: string;
}

export function AntdRangePicker({
  value,
  onChange,
  placeholder = ["Start date", "End date"],
  disabled = false,
  className,
  format = "YYYY-MM-DD",
}: AntdRangePickerProps) {
  const handleChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    if (dates) {
      onChange?.([dates[0]?.toDate() ?? null, dates[1]?.toDate() ?? null]);
    } else {
      onChange?.(null);
    }
  };

  const dayjsValue: [Dayjs | null, Dayjs | null] | null = value
    ? [value[0] ? dayjs(value[0]) : null, value[1] ? dayjs(value[1]) : null]
    : null;

  return (
    <AntDatePicker.RangePicker
      value={dayjsValue as [Dayjs | null, Dayjs | null] | null}
      onChange={handleChange}
      placeholder={placeholder}
      disabled={disabled}
      format={format}
      className={cn("w-full", className)}
      size="middle"
    />
  );
}
