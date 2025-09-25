"use client";

import React, { useEffect, useState, useRef } from "react";

// Hook para detectar visibilidade
const useInView = (options) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
    }, options);

    if (ref.current) observer.observe(ref.current);

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [options]);

  return [ref, inView];
};

// Hook para animar número com valor inicial e duração customizada
const useCountUp = (target, trigger, start = 70, duration = 1000) => {
  const [count, setCount] = useState(start);

  useEffect(() => {
    if (!trigger) return;

    const startTime = performance.now();

    const step = (timestamp) => {
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const current = Math.floor(start + progress * (target - start));
      setCount(current);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };

    requestAnimationFrame(step);
  }, [trigger, target, start, duration]);

  return count;
};

const StatItem = ({ target, description, trigger }) => {
  const count = useCountUp(target, trigger, 70, 1000); 

  return (
    <div className="max-w-3xs">
      <span className="text-5xl font-semibold">{count}%</span>
      <p className="mt-6 text-lg">{description}</p>
    </div>
  );
};

const Stats01Page = () => {
  const [ref, inView] = useInView({ threshold: 0.4 });

  return (
    <div className="flex items-center justify-center bg-[#eff6ff80] border shadow-inner container lg:w-250  rounded-3xl mx-auto mt-20">
      <div ref={ref} className=" mx-auto py-12 text-center">
        <h2 className="text-4xl md:text-5xl font-semibold tracking-tighter">
        Por que somos a melhor escolha?
        </h2>
        <p className="mt-4 text-xl text-muted-foreground">
          Because after switching to us...
        </p>

        <div className="mt-16 sm:mt-24 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16 justify-center ">
          <StatItem target={96} trigger={inView} description="Precisão na detecção" />
          <StatItem target={40} trigger={inView} description="Economia média" />
          <StatItem target={100} trigger={inView} description="Satisfação dos moradores" />
        </div>
      </div>
    </div>
  );
};

export default Stats01Page;
