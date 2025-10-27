import React, { useState, useEffect } from "react";
import before1 from "../assets/before1.jpeg";
import after1 from "../assets/after1.jpeg";
import before2 from "../assets/before2.jpeg";
import after2 from "../assets/after2.jpeg";
import before3 from "../assets/before3.jpeg";
import after3 from "../assets/after3.jpeg";

export default function AvantApres() {
  const examples = [
    { before: before1, after: after1 },
    { before: before2, after: after2 },
    { before: before3, after: after3 },
  ];

  const [sliders, setSliders] = useState([50, 50, 50]);

  // Effet fondu automatique (fait bouger légèrement le slider)
  useEffect(() => {
    const interval = setInterval(() => {
      setSliders((prev) =>
        prev.map((v) => {
          const newVal = v + (Math.random() * 10 - 5);
          return Math.max(20, Math.min(80, newVal));
        })
      );
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleSliderChange = (index, value) => {
    const newSliders = [...sliders];
    newSliders[index] = parseInt(value);
    setSliders(newSliders);
  };

  return (
    <div className="min-h-screen bg-[#1E1E2F] text-white flex flex-col items-center py-16 px-4">
      <h1 className="text-4xl font-bold mb-10 bg-gradient-to-r from-blue-400 to-pink-500 bg-clip-text text-transparent text-center">
        Avant / Après
      </h1>

      <p className="text-gray-300 mb-12 max-w-2xl text-center">
        Découvre la précision et le réalisme de nos transformations IA ! Achète des credits pour générer tes propres photos non censurées..🔞
      </p>

      <div className="flex flex-col gap-16 w-full items-center">
        {examples.map((pair, index) => (
          <div
            key={index}
            className="relative w-[280px] h-[480px] sm:w-[320px] sm:h-[540px] md:w-[360px] md:h-[600px] lg:w-[400px] lg:h-[640px] overflow-hidden rounded-2xl shadow-2xl border border-white/10"
          >
            {/* Image Après (base) */}
            <img
              src={pair.after}
              alt={`Après ${index + 1}`}
              className="absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out"
            />

            {/* Image Avant superposée */}
            <div
              className="absolute inset-0 overflow-hidden transition-all duration-1000 ease-in-out"
              style={{ height: `${sliders[index]}%` }}
            >
              <img
                src={pair.before}
                alt={`Avant ${index + 1}`}
                className="w-full h-full object-cover transition-opacity duration-1000 ease-in-out"
              />
            </div>

            {/* Slider vertical */}
            <input
              type="range"
              min="0"
              max="100"
              value={sliders[index]}
              onChange={(e) => handleSliderChange(index, e.target.value)}
              className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 w-[60%] accent-pink-500 cursor-pointer"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

