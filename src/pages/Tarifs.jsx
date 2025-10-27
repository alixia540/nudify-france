import React from "react";

export default function Tarifs() {
  return (
    <div className="space-y-10 text-center">
      <h2 className="text-3xl font-bold">Nos Tarifs</h2>
      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {["Photo", "Pass VIP", "Pass PREMIUM"].map((item, i) => (
          <div
            key={i}
            className="p-6 rounded-2xl bg-[#2A2A3D] border border-[#3A2BE2]"
          >
            <h3 className="text-xl font-semibold mb-4">{item}</h3>
            <div className="text-3xl font-bold text-[#FF3EA5]">– €</div>
            <p className="text-gray-400 mt-3">
              Ajoutez ici votre description de l'offre {item.toLowerCase()}.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
