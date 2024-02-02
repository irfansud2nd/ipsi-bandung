"use client";
import axios from "axios";
import { useState, useEffect } from "react";
import Link from "next/link";

type Props = {
  title: string;
  apiUrl: string;
  link?: string;
};

const CountFirestore = ({ title, apiUrl, link }: Props) => {
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);

  const getCount = () => {
    axios
      .get(apiUrl)
      .then((res) => {
        setCount(res.data.count);
      })
      .catch((error) => alert(error))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getCount();
  }, []);

  return (
    <div className="shadow-md bg-gray-900 text-white flex flex-col gap-1 p-1 w-fit rounded-md mb-1 text-center">
      <h3 className="font-semibold">{title}</h3>
      <p className="font-bold text-2xl">{count}</p>
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
