"use client";

import { useEffect, useRef } from "react";
import Lottie from "lottie-react";
import animationData from "./loading.json";

export default function Loading() {
  const lottieRef = useRef(null);

  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.setSpeed(1.5); 
    }
  }, []);

  return (
    <div className="">
      {/* <h1 className="flex justify-center font-semibold">Carregando informacoes</h1> */}
      <div className="w-50 h-50 flex items-center justify-center mx-auto">
        <Lottie
          animationData={animationData}
          lottieRef={lottieRef}
          loop={true}
        />
      </div>
    </div>
  );
}
