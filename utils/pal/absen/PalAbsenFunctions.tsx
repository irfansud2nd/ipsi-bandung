import TandaAbsen from "@/components/admin/pal/absen/TandaAbsen";
import { tipeKehadiran } from "./PalAbsenConstants";

// GET TODAY
export const getToday = (config: "month+year" | "fullDate" | "day") => {
  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${(now.getMonth() + 1)
    .toString()
    .padStart(2, "0")}`;
  const thisDay = `${now.getDate().toString().padStart(2, "0")}`;
  const fullDate = `${thisMonth}-${thisDay}`;

  switch (config) {
    case "month+year":
      return thisMonth;
    case "fullDate":
      return fullDate;
    case "day":
      return thisDay;
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
  const result: any = {
    hadir: 0,
    izin: 0,
    sakit: 0,
    alfa: 0,
  };
  if (!data[`${month}-compressed`]) {
    getDaysInMonth(month).map((day) => {
      tipeKehadiran.map((item) => {
        if (item == "alfa") {
          if (
            getToday("day") > day &&
            data[`${month}-hadir`] &&
            data[`${month}-hadir`].indexOf(day) < 0
          )
            result[item] += 1;
        } else {
          if (
            data[`${month}-${item}`] &&
            data[`${month}-${item}`].indexOf(day) >= 0
          )
            result[item] += 1;
        }
      });
    });
  } else {
    const compressedData = data[`${month}-compressed`];
    tipeKehadiran.map((item) => {
      if (item != "hadir") {
        result[item] = compressedData[item].length;
      }
    });
    result.hadir =
      getDaysInMonth(month).length - result.sakit - result.izin - result.alfa;
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
export const checkAbsen = (
  data: Record<string, string[]>,
  month: string,
  day: string
) => {
  if (!data[`${month}-compressed`]) {
    if (data[`${month}-hadir`] && data[`${month}-hadir`].indexOf(day) >= 0)
      return <TandaAbsen as="td" ket="hadir" key={day} />;
    if (data[`${month}-izin`] && data[`${month}-izin`].indexOf(day) >= 0)
      return <TandaAbsen as="td" ket="izin" key={day} />;
    if (data[`${month}-sakit`] && data[`${month}-sakit`].indexOf(day) >= 0)
      return <TandaAbsen as="td" ket="sakit" key={day} />;
    if (
      getToday("day") > day &&
      data[`${month}-hadir`] &&
      data[`${month}-hadir`].indexOf(day) < 0
    )
      return <TandaAbsen as="td" ket="alfa" key={day} />;
    return <TandaAbsen as="td" ket="" key={day} />;
  } else {
    const compressedData: any = data[`${month}-compressed`];
    if (compressedData.izin.indexOf(day) >= 0)
      return <TandaAbsen as="td" ket="izin" key={day} />;
    if (compressedData.sakit.indexOf(day) >= 0)
      return <TandaAbsen as="td" ket="sakit" key={day} />;
    if (compressedData.alfa.indexOf(day) >= 0)
      return <TandaAbsen as="td" ket="alfa" key={day} />;
    return <TandaAbsen as="td" ket="hadir" key={day} />;
  }
};
