"use client";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { controlToast, toastAxiosError } from "@/utils/shared/functions";
import InlineLoading from "../loading/InlineLoading";

type Props = {
  title: string;
  apiUrl: string;
  link?: string;
};

const CountFirestore = ({ title, apiUrl, link }: Props) => {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(0);

  const toastId = useRef(null);

  const getCount = () => {
    setLoading(true);
    axios
      .get(apiUrl)
      .then((res) => {
        console.log(res);
        setResult(res.data.count);
      })
      .catch((error) => toastAxiosError(error, toastId, true))
      .finally(() => setLoading(false));
  };

  if (!apiUrl) controlToast("apiUrl not found", toastId, "error", true);

  useEffect(() => {
    if (apiUrl) getCount();
  }, []);

  return (
    <div className="shadow-md bg-gray-900 text-white flex flex-col gap-1 p-1 w-fit rounded-md mb-1 text-center">
      <h3 className="font-semibold">{title}</h3>
      <p className="font-bold text-2xl">
        {loading ? <InlineLoading /> : result}
      </p>
      <div className="flex gap-1 justify-center">
        <button className="btn_white text-sm" onClick={getCount}>
          Refresh
        </button>
        {link && (
          <Link href={link} className="btn_white text-sm">
            Open
          </Link>
        )}
      </div>
    </div>
  );
};
export default CountFirestore;
