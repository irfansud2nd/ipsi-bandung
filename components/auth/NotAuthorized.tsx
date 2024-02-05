import image from "@/public/images/not_authorized.png";
import Link from "next/link";

type Props = {
  pal?: { onRequest: boolean };
};
const NotAuthorized = ({ pal }: Props) => {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <div className="flex gap-1 items-center">
        <h1 className="text-2xl sm:text-3xl font-bold max-w-[200px]">
          Maaf, Anda tidak memiliki izin untuk mengakses halaman ini.
        </h1>
        <img src={image.src} className="w-[150px] sm:w-[250px]" />
      </div>
      {pal &&
        (pal.onRequest ? (
          <p className="text-center">
            Akun anda sedang menunggu persetujuan admin / nonaktif
          </p>
        ) : (
          <div className="text-center">
            <p className="text-gray-900">Bagian dari PAL?</p>
            <Link
              href="/pal/pendaftaran"
              className="btn_gray pb-0.5 font-semibold"
            >
              Daftar disini
            </Link>
          </div>
        ))}
    </div>
  );
};
export default NotAuthorized;
