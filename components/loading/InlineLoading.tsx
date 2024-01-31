import { AiOutlineLoading3Quarters } from "react-icons/ai";

type Props = {
  className?: string;
};

const InlineLoading = ({ className }: Props) => {
  return (
    <AiOutlineLoading3Quarters
      className={`inline animate-spin font-extrabold mb-1 mx-1 ${className}`}
    />
  );
};
export default InlineLoading;
