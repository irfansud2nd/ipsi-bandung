import image from "@/public/images/login.png";

const NotLoggedIn = () => {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="flex gap-1 items-center">
        <h1 className="text-2xl sm:text-3xl font-bold max-w-[200px]">
          Maaf, anda harus melalukan login untuk mengakses halaman ini
        </h1>
        <img src={image.src} className="w-[150px] sm:w-[250px] h-fit" />
      </div>
    </div>
  );
};
export default NotLoggedIn;
