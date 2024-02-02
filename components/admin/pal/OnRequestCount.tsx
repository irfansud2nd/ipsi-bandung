"use client";
import axios from "axios";
import { useState, useEffect } from "react";
import Link from "next/link";

const OnRequestCount = () => {
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);

  const getCount = () => {
    axios
      .get("/api/pal/request/count")
      .then((res) => setCount(res.data.count))
      .catch((error) => alert(error))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    // getCount();
  }, []);

  return (
    <div className="shadow-md bg-gray-900 text-white flex flex-col gap-1 p-1 w-fit rounded-md mb-1 text-center">
      <h3 className="font-semibold">PAL Request</h3>
      <p className="font-bold text-2xl">0</p>
      <div className="flex gap-1 justify-center">
        <button className="btn_white text-sm">Refresh</button>
        <Link href={"/admin/pal/request"} className="btn_white text-sm">
          Open
        </Link>
      </div>
    </div>
  );
};
export default OnRequestCount;
