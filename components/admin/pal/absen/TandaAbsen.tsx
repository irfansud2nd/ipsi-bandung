type Props = {
  ket: "hadir" | "izin" | "sakit" | "alfa" | string;
  as: "td" | "span";
  time: string;
  byAdmin?: boolean;
  showTimestamp?: boolean;
  className?: string;
};
const TandaAbsen = ({
  ket,
  className,
  as,
  showTimestamp,
  time,
  byAdmin,
}: Props) => {
  if (as == "td") {
    return (
      <td
        className={`text-white text-center whitespace-nowrap
        ${ket == "hadir" && "bg-green-500"}
        ${ket == "izin" && "bg-yellow-500"}
        ${ket == "sakit" && "bg-blue-500"}
        ${ket == "alfa" && "bg-red-500"}
        ${className}
        `}
      >
        {ket.charAt(0).toUpperCase()}
        {byAdmin && "*"}
        {showTimestamp && time && <span> | {time}</span>}
      </td>
    );
  }
  return (
    <span
      className={`text-white text-center px-1 rounded
        ${ket == "hadir" && "bg-green-500"}
        ${ket == "izin" && "bg-yellow-500"}
        ${ket == "sakit" && "bg-blue-500"}
        ${ket == "alfa" && "bg-red-500"}
        ${className}
        `}
    >
      {ket.charAt(0).toUpperCase()}
      {byAdmin && "*"}
    </span>
  );
};
export default TandaAbsen;
