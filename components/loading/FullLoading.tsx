import { TbLoader3 } from "react-icons/tb";

const FullLoading = ({ text }: { text?: string }) => {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="flex flex-col gap-3 items-center">
        <TbLoader3 className="text-7xl animate-spin" />
        <h1 className="text-2xl sm:text-3xl font-bold max-w-[300px] sm:max-w-full text-center">
          {text || "Loading"}
        </h1>
      </div>
    </div>
  );
};
export default FullLoading;
