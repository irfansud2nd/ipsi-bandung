type Props = {
  children: React.ReactNode;
  className?: string;
  title?: string;
};
const CenterBoxShadow = ({ children, className, title }: Props) => {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      {title && <h1 className="page_title">{title}</h1>}
      <div
        className={`w-full h-full sm:max-w-[500px] sm:max-h-[400px] shadow-2xl rounded-md bg-gray-50 flex justify-center items-center border-2 border-gray-300 ${className}`}
      >
        {children}
      </div>
    </div>
  );
};
export default CenterBoxShadow;
