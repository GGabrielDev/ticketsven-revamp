import { html } from "htm/preact";
import { useState } from "preact/hooks";
import { Box, Button, Container, TextField } from "@mui/material";
import { DatePicker, DatePickerProps } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";

type DateRange = Record<"startDate" | "endDate", string>; // Array of two Date strings

const TodayButton = ({ onClick }: { onClick: () => void }) => html`
  <${Button} variant="contained" onClick=${onClick}> Today <//>
`;

const YesterdayButton = ({ onClick }: { onClick: () => void }) => html`
  <${Button} variant="contained" onClick=${onClick}> Yesterday <//>
`;

export default function Landing() {
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: dayjs().startOf("day").format(),
    endDate: dayjs().add(1, "day").startOf("day").format(),
  });

  const handleDateChange = (key: keyof DateRange) => (date: string) => {
    setDateRange({ ...dateRange, [key]: date });
  };

  const handleTodayClick = () => {
    const startDate = dayjs().startOf("day").format();
    const endDate = dayjs().add(1, "day").startOf("day").format();
    setDateRange({ startDate, endDate });
  };

  const handleYesterdayClick = () => {
    const startDate = dayjs().subtract(1, "day").startOf("day").format();
    const endDate = dayjs().startOf("day").format();
    setDateRange({ startDate, endDate });
  };

  return html`
    <${Container}
      maxWidth="sm"
      sx=${{
        display: "flex",
        flexFlow: "column wrap",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
      }}
    >
      <${DatePicker}
        label="Start Date"
        value=${dateRange.startDate}
        onChange=${handleDateChange("startDate")}
        renderInput=${(params: DatePickerProps<Dayjs, unknown>) =>
          html`<${TextField} ...${params} />`}
      />
      <${DatePicker}
        label="End Date"
        value=${dateRange.endDate}
        onChange=${handleDateChange("endDate")}
        renderInput=${(params: DatePickerProps<Dayjs, unknown>) =>
          html`<${TextField} ...${params} />`}
      />
      <${TodayButton} onClick=${handleTodayClick} />
      <${YesterdayButton} onClick=${handleYesterdayClick} />
    <//>
  `;
}
