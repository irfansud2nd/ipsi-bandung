"use client";
import { useState } from "react";
import Rodal from "rodal";
import "rodal/lib/rodal.css";

const useConfirmationRodal = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [content, setContent] = useState({
    title: "",
    message: "",
  });
  const [resolveCallback, setResolveCallback] = useState<any>(null);

  const confirm = (title: string, message: string, cancelLabel?: string) => {
    setContent({
      title,
      message,
    });
    setIsVisible(true);
    return new Promise((resolve) => {
      setResolveCallback(() => resolve);
    });
  };

  const handleConfirm = (result: boolean) => {
    resolveCallback(result);
    setIsVisible(false);
  };

  const ConfirmationRodal = () => (
    <Rodal visible={isVisible} onClose={() => handleConfirm(false)}>
      <div className="flex flex-col justify-between h-full w-full">
        <h1 className="font-semibold text-lg capitalize">{content.title}</h1>
        <p className="text-justify">{content.message}</p>
        <div className="flex w-full gap-2 justify-end">
          <button onClick={() => handleConfirm(true)} className="btn_green">
            Ya
          </button>
          <button onClick={() => handleConfirm(false)} className="btn_red">
            Batal
          </button>
        </div>
      </div>
    </Rodal>
  );

  return {
    confirm,
    ConfirmationRodal,
  };
};
export default useConfirmationRodal;
