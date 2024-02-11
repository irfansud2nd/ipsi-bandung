import TandaAbsen from "@/components/admin/pal/absen/TandaAbsen";
import { tipeKehadiran } from "./PalAbsenConstants";

// GET TODAY
export const getToday = (
  config: "month+year" | "fullDate" | "day" | "hour+minute"
) => {
  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${(now.getMonth() + 1)
    .toString()
    .padStart(2, "0")}`;
  const thisDay = `${now.getDate().toString().padStart(2, "0")}`;
  const time = `${now.getHours()}:${now.getMinutes()}`;
  const fullDate = `${thisMonth}-${thisDay}`;

  switch (config) {
    case "month+year":
      return thisMonth;
    case "fullDate":
      return fullDate;
    case "day":
      return thisDay;
    case "hour+minute":
      return time;
  }
};

// GET DAY IN MONTH
export const getDaysInMonth = (monthYear: string) => {
  const splittedMonthYear = monthYear.split("-");
  const month = Number(splittedMonthYear[1]);
  const year = Number(splittedMonthYear[0]);
  const days = new Date(year, month, 0).getDate();
  let daysArr = [];
  for (let i = 1; i <= days; i++) {
    daysArr.push(i.toString().padStart(2, "0"));
  }
  return daysArr;
};

// SUMMARIZE ABSEN
export const sumAbsen = (data: any, month: string) => {
  const result = {
    hadir: 0,
    izin: 0,
    sakit: 0,
    alfa: 0,
  };
  const absen = data[`absen-${month}`];
  const days = getDaysInMonth(month);
  if (absen) {
    days.map((day) => {
      if (!absen[day]) {
        if (getToday("day") > day) result.alfa += 1;
        return;
      }
      if (absen[day].tipe == "alfa") result.alfa += 1;
      if (absen[day].tipe == "hadir") result.hadir += 1;
      if (absen[day].tipe == "izin") result.izin += 1;
      if (absen[day].tipe == "sakit") result.sakit += 1;
    });
  }
  return (
    <>
      <td>{result.hadir}</td>
      <td>{result.izin}</td>
      <td>{result.sakit}</td>
      <td>{result.alfa}</td>
    </>
  );
};

// CHECK ABSEN
export const checkAbsen = (data: any, month: string, day: string) => {
  const result = {
    tipe: "",
    time: "",
    byPelatih: false,
  };
  if (!data[`absen-${month}`]) return result;
  const absen = data[`absen-${month}`][day];
  if (absen) {
    result.tipe = absen.tipe;
    result.time = absen.time;
    result.byPelatih = absen.byPelatih;
  } else if (getToday("day") > day) {
    result.tipe = "alfa";
  }
  return result;
};
