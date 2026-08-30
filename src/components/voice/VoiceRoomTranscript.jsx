import React from "react";
import { motion } from "framer-motion";

/**
 * Trace écrite de la conversation vocale : chaque parole devient une bulle.
 */
export default function VoiceRoomTranscript({ messages = [], endRef }) {
  if (messages.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-purple-200/70 text-sm">
        Parle — la conversation s'inscrira ici.
      </div>
    );
  }

  return (
    <div className="space-y-4 py-4">
      {messages.map((m, i) => (
        <motion.div
          key={`${m.timestamp || i}-${i}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap ${
              m.role === 'user'
                ? 'bg-purple-500/30 text-white border border-purple-400/30'
                : 'bg-white/10 text-purple-50 border border-white/10'
            }`}
          >
            <p className="text-xs opacity-60 mb-1">
              {m.role === 'user' ? 'Vous' : 'Druide'}
            </p>
            {m.content}
            {m.image_urls?.map((url) => (
              <img key={url} src={url} alt="" className="mt-2 rounded-lg max-h-48" />
            ))}
            {m.diagram_url && (
              <img src={m.diagram_url} alt="" className="mt-2 rounded-lg max-h-64 bg-white" />
            )}
            {m.metadata?.imageUrl && (
              <img src={m.metadata.imageUrl} alt="" className="mt-2 rounded-lg max-h-64" />
            )}
          </div>
        </motion.div>
      ))}
      <div ref={endRef} />
    </div>
  );
}