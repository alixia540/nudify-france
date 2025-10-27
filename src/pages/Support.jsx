import React from "react";

export default function Support() {
  return (
    <div className="min-h-screen bg-[#1E1E2F] text-white flex flex-col items-center py-16 px-6">
      <h1 className="text-4xl font-bold mb-10 bg-gradient-to-r from-blue-400 to-pink-500 bg-clip-text text-transparent text-center">
        Support & Assistance
      </h1>

      {/* Lien Discord principal */}
      <a
        href="https://discord.gg/AhbYZmxxqX"
        target="_blank"
        rel="noopener noreferrer"
        className="text-xl font-semibold text-pink-400 hover:text-pink-300 underline mb-8 transition-all duration-300"
      >
        🔗 Rejoindre notre serveur Discord
      </a>

      <p className="text-gray-300 mb-10 max-w-xl text-center leading-relaxed">
        Si tu rencontres un problème, rejoins notre serveur Discord officiel.  
        Une fois connecté, suis les étapes ci-dessous :
      </p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-10 max-w-3xl w-full">
        {/* Étape 1 */}
        <div className="bg-[#252542] p-8 rounded-2xl border border-white/10 hover:border-pink-400/40 shadow-xl transition-all duration-300 flex flex-col items-center text-center">
          <h2 className="text-2xl font-semibold mb-3">📩 Ouvrir un ticket</h2>
          <p className="text-gray-400 text-sm">
            Si tu as besoin d’aide ou une question, ouvre un ticket dans le salon dédié.  
            Un membre du staff te répondra rapidement.
          </p>
        </div>

        {/* Étape 2 */}
        <div className="bg-[#252542] p-8 rounded-2xl border border-white/10 hover:border-blue-400/40 shadow-xl transition-all duration-300 flex flex-col items-center text-center">
          <h2 className="text-2xl font-semibold mb-3">🎧 Rejoindre le salon vocal “support-voc”</h2>
          <p className="text-gray-400 text-sm">
            Pour une aide directe et plus rapide, rejoins le salon vocal   
            <span className="text-blue-400 font-semibold"> #support-voc </span>  
             pour discuter avec un membre de l’équipe.
          </p>
        </div>
      </div>

      <p className="text-gray-400 mt-12 text-sm text-center max-w-2xl">
        Merci d’utiliser Nudify France 💙  
        Notre équipe est disponible pour t’aider à tout moment.
      </p>
    </div>
  );
}
