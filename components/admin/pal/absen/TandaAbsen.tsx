type Props = {
  ket: "hadir" | "izin" | "sakit" | "alfa" | string;
  as: "td" | "span";
  className?: string;
};
const TandaAbsen = ({ ket, className, as }: Props) => {
  if (as == "td") {
    return (
      <td
        className={`text-white text-center
        ${ket == "hadir" && "bg-green-500"}
        ${ket == "izin" && "bg-yellow-500"}
        ${ket == "sakit" && "bg-blue-500"}
        ${ket == "alfa" && "bg-red-500"}
        ${className}
        `}
      >
        {ket.charAt(0).toUpperCase()}
      </td>
    );
  }
  return (
    <span
      className={`text-white text-center px-1 
        ${ket == "hadir" && "bg-green-500"}
        ${ket == "izin" && "bg-yellow-500"}
        ${ket == "sakit" && "bg-blue-500"}
        ${ket == "alfa" && "bg-red-500"}
        ${className}
        `}
    >
      {ket.charAt(0).toUpperCase()}
    </span>
  );
};
export default TandaAbsen;
