import image from "@/public/images/construction_vector.png";
const UnderConstruction = () => {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="flex gap-1 items-center">
        <h1 className="text-2xl sm:text-3xl font-bold max-w-[200px]">
          Sorry, this page is still under construction
        </h1>
        <img src={image.src} className="max-w-[50vw] w-[150px] sm:w-[250px]" />
      </div>
    </div>
  );
};
export default UnderConstruction;
