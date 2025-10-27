import React from "react";

export default function AvantApres() {
  return (
    <div className="space-y-10 text-center">
      <h2 className="text-3xl font-bold">Résultats Nudify France</h2>
      <p className="text-gray-400">
        Découvrez la transformation avant / après.
      </p>
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <div className="bg-[#2A2A3D] rounded-2xl p-4">
          <h4 className="text-lg font-semibold mb-2">Avant</h4>
          <div className="aspect-[4/5] bg-gray-700 rounded-xl"></div>
        </div>
        <div className="bg-[#2A2A3D] rounded-2xl p-4">
          <h4 className="text-lg font-semibold mb-2">Après</h4>
          <div className="aspect-[4/5] bg-gray-700 rounded-xl"></div>
        </div>
      </div>
    </div>
  );
}
