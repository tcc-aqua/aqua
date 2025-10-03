"use client";

import { useEffect, useRef } from "react";
import Lottie from "lottie-react";
import animationData from "./loading.json";

export default function Loading() {
  const lottieRef = useRef(null);

  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.setSpeed(3.5); 
    }
  }, []);

  return (
    <div className="bg-muted">
      <div className="w-40 h-40 flex items-center justify-center mx-auto">
        <Lottie
          animationData={animationData}
          lottieRef={lottieRef}
          loop={true}
        />
      </div>
    </div>
  );
}
