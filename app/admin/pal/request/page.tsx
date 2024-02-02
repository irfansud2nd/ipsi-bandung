"use client";

import FullLoading from "@/components/loading/FullLoading";
import InlineLoading from "@/components/loading/InlineLoading";
import { PalState } from "@/utils/form/pal/palConstants";
import { controlToast } from "@/utils/shared/functions";
import axios from "axios";
import { useEffect, useRef, useState } from "react";

const page = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const toastId = useRef(null);

  const getRequest = () => {
    setLoading(true);
    axios
      .get("/api/pal/request")
      .then((res) => setData(res.data.data))
      .catch((error) => {
        setData([]);
        controlToast(error.response.data.message, toastId, "error", true);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getRequest();
  }, []);

  const verifyRequest = (id: string) => {
    controlToast("Memverifikasi akun", toastId, "loading", true);
    setLoading(true);
    axios
      .patch("/api/pal/request", { id })
      .then((res) =>
        controlToast("Akun PAL berhasil diverifikasi", toastId, "success")
      )
      .catch((error) => {
        controlToast(
          error.response.data.message || "Gagal memverifikasi akun",
          toastId,
          "error"
        );
      })
      .finally(() => setLoading(false));
  };

  const deleteRequest = (id: string) => {
    if (!confirm("Are you sure")) return;
    controlToast("Menghapus request", toastId, "loading", true);
    setLoading(true);
    axios
      .delete(`/api/pal/request/${id}`)
      .then((res) => {
        controlToast("Request akun PAL berhasil dihapus", toastId, "success");
      })
      .catch((error) => {
        controlToast(error.response.data.message, toastId, "error");
      })
      .finally(() => setLoading(false));
  };

  if (!data.length && loading) return <FullLoading text="Memuat Data" />;

  return (
    <div>
      <h1 className="page_title">Request akun PAL</h1>
      <button
        className="btn_green text-sm mb-1"
        onClick={getRequest}
        disabled={loading}
      >
        Refresh
        {loading && (
          <>
            <span>... </span> <InlineLoading />
          </>
        )}
      </button>
      {!data.length ? (
        <p className="text-red-500 font-bold">Tidak ada request</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Lenkap</th>
              <th>Email</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item: PalState, i) => (
              <tr key={item.id}>
                <td>{i + 1}</td>
                <td>{item.namaLengkap}</td>
                <td>{item.email}</td>
                <td>
                  <div className="flex gap-1 py-1">
                    <button
                      className="btn_green text-sm"
                      onClick={() => verifyRequest(item.id)}
                      disabled={loading}
                    >
                      Verify
                    </button>
                    <button
                      className="btn_red text-sm"
                      onClick={() => deleteRequest(item.id)}
                      disabled={loading}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
export default page;
