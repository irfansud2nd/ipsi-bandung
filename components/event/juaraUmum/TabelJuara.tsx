import { compare } from "@/utils/shared/functions";

type Props = {
  medalis: string[];
  label: "SD" | "SMP" | "SMA" | "Dewasa";
  rawData: any[];
};

const TabelJuara = ({ medalis, label, rawData }: Props) => {
  const filterData = (array: any[]) => {
    return array.filter((item) => {
      if (medalis.length > 2) {
        return (
          item[medalis[0]] != 0 ||
          item[medalis[1]] != 0 ||
          item[medalis[2]] != 0
        );
      } else {
        return item[medalis[0]] != 0 || item[medalis[1]] != 0;
      }
    });
  };
  const dataSort = () => {
    const filteredData = filterData(rawData);
    if (medalis.length > 2) {
      return filteredData
        .sort(compare("namaKontingen", "asc"))
        .sort(compare(medalis[2], "desc"))
        .sort(compare(medalis[1], "desc"))
        .sort(compare(medalis[0], "desc"));
    } else {
      return filteredData
        .sort(compare("namaKontingen", "asc"))
        .sort(compare(medalis[1], "desc"))
        .sort(compare(medalis[0], "desc"));
    }
  };

  const data = dataSort();
  return (
    <div>
      <h1 className="font-semibold text-xl">Tingkat {label}</h1>
      <div className="max-h-[351px] overflow-y-scroll">
        <table className="w-full">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Kontingen</th>
              <th>Emas</th>
              <th>Perak</th>
              {medalis.length > 2 && <th>Perunggu</th>}
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => (
              <tr key={item.idKontingen}>
                <td>{i + 1}</td>
                <td>{item.namaKontingen.toUpperCase()}</td>
                <td>{item[medalis[0]]}</td>
                <td>{item[medalis[1]]}</td>
                {medalis.length > 2 && <td>{item[medalis[2]]}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default TabelJuara;
