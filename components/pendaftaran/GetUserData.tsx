"use effect";
import { useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSession } from "next-auth/react";
import {
  getEventIdByPathname,
  toastAxiosError,
} from "@/utils/shared/functions";
import { usePathname } from "next/navigation";
import axios from "axios";
import { setKontingensRedux } from "@/utils/redux/kontingens/kontingensSlice";
import { setOfficialsRedux } from "@/utils/redux/officials/officialsSlice";
import { setPesertasRedux } from "@/utils/redux/pesertas/pesertasSlice";
const GetUserData = ({
  setLoading,
}: {
  setLoading: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const dispatch = useDispatch();
  const session = useSession();
  const toastId = useRef(null);
  const pathname = usePathname();
  const eventId = getEventIdByPathname(pathname);

  const getKontingens = () => {
    console.log("getKontingens");
    const email = session.data?.user?.email as string;
    axios
      .get(`/api/participant/kontingens/${email}`)
      .then((res) => {
        dispatch(
          setKontingensRedux({ eventId, kontingens: res.data.container })
        );
        setLoading((prev) => prev + 1);
        console.log("getKontingens COMPLETE");
      })
      .catch((error) => toastAxiosError(error, toastId));
  };

  const getOfficials = () => {
    console.log("getOfficials");
    const email = session.data?.user?.email as string;
    axios
      .get(`/api/participant/officials/${email}`)
      .then((res) => {
        dispatch(setOfficialsRedux({ eventId, officials: res.data.container }));
        setLoading((prev) => prev + 1);
        console.log("getOfficials COMPLETE");
      })
      .catch((error) => toastAxiosError(error, toastId));
  };

  const getPesertas = () => {
    console.log("getPesertas");
    const email = session.data?.user?.email as string;
    axios
      .get(`/api/participant/pesertas/${email}`)
      .then((res) => {
        dispatch(setPesertasRedux({ eventId, pesertas: res.data.container }));
        setLoading((prev) => prev + 1);
        console.log("getPesertas COMPLETE");
      })
      .catch((error) => toastAxiosError(error, toastId));
  };

  const getAll = () => {
    getKontingens();
    getOfficials();
    getPesertas();
  };

  useEffect(() => {
    getAll();
  }, []);
  // return <></>;
  return (
    <div className="flex gap-1 text-sm h-fit mb-1">
      <button className="btn_green" onClick={getAll}>
        Refresh All
      </button>
      <button className="btn_green" onClick={getKontingens}>
        Refresh Kontingems
      </button>
      <button className="btn_green" onClick={getOfficials}>
        Refresh Officials
      </button>
      <button className="btn_green" onClick={getPesertas}>
        Refresh Pesertas
      </button>
    </div>
  );
};
export default GetUserData;
