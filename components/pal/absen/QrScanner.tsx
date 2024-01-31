"use client";

import { Html5Qrcode } from "html5-qrcode";
import { useEffect, useState } from "react";
import { IoCameraReverseOutline } from "react-icons/io5";

type Props = {
  setResult: React.Dispatch<React.SetStateAction<string>>;
};

const QrScanner = ({ setResult }: Props) => {
  const [cameras, setCameras] = useState<string[]>([]);
  const [cameraIndex, setCameraIndex] = useState(0);

  useEffect(() => {
    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices && devices.length) {
          setCameras(devices.map((device) => device.id));
        }
      })
      .catch((err) => console.log(err));
  }, []);

  let scanner: Html5Qrcode;

  useEffect(() => {
    if (cameras.length) {
      scanner = new Html5Qrcode("reader");
      scanner
        .start(
          { facingMode: "environment" },
          {
            fps: 10, // Optional, frame per seconds for qr code scanning
          },
          (decodedText, decodedResult) => {
            // do something when code is read
            console.log("decodedResult", decodedResult);
            console.log("decodedText", decodedText);
            setResult(decodedText);
            scanner.stop();
          },
          (errorMessage) => {
            // parse error, ignore it.
            console.log("errorMessage", errorMessage);
          }
        )
        .catch((err: any) => {
          // Start failed, handle it.
          console.log("err", err);
        });
    }
    return () => {
      if (scanner && scanner.isScanning) scanner.stop();
    };
  }, [cameraIndex, cameras]);

  const changeCamera = () => {
    if (cameraIndex == cameras.length - 1) {
      setCameraIndex(0);
    } else {
      setCameraIndex((prev) => prev + 1);
    }
  };

  return <div id="reader" className="w-full sm:max-w-[500px]"></div>;
};
export default QrScanner;
