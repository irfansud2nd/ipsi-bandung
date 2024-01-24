"use client";
import InlineLoading from "@/components/loading/InlineLoading";
import { controlToast } from "@/utils/shared/functions";
import axios from "axios";
import { error } from "console";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const DownloadProposal = ({ id }: { id: string }) => {
  const [downloadUrl, setDownloadUrl] = useState();
  const [error, setError] = useState("");

  const getDownloadUrl = async () => {
    axios
      .get(`/api/proposal/${id}`)
      .then((res) => setDownloadUrl(res.data.downloadUrl))
      .catch((err) => {
        console.log(err);
        setError(err);
      });
  };

  useEffect(() => {
    getDownloadUrl();
  }, []);

  return (
    <>
      {downloadUrl ? (
        <Link href={downloadUrl} className="btn_green" target="_blank">
          Proposal
        </Link>
      ) : error ? (
        <span className="btn_red">Proposal tak terserdia</span>
      ) : (
        <span className="btn_green">
          Memuat Proposal <InlineLoading />
        </span>
      )}
    </>
  );
};
export default DownloadProposal;
