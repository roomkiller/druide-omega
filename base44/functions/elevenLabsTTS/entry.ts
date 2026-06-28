/**
 * ElevenLabs Text-to-Speech Function
 * Generates voiceovers using ElevenLabs API
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { text, voice_id, scene_number } = await req.json();

    if (!text || !voice_id) {
      return Response.json({ error: 'Missing text or voice_id' }, { status: 400 });
    }

    const apiKey = Deno.env.get("ELEVENLABS_API_KEY");
    if (!apiKey) {
      return Response.json({ error: 'ElevenLabs API key not configured' }, { status: 500 });
    }

    // Appel à ElevenLabs API
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voice_id}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          text: text,
          model_id: "eleven_monolingual_v1",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75
          }
        })
      }
    );

    if (!response.ok) {
      const error = await response.text();
      return Response.json({ error: `ElevenLabs error: ${error}` }, { status: 500 });
    }

    // Convertir audio blob en URL (en production, sauvegarder sur storage)
    const audioBuffer = await response.arrayBuffer();
    const audioUrl = `data:audio/mpeg;base64,${btoa(String.fromCharCode(...new Uint8Array(audioBuffer)))}`;

    // Estimer durée (approximation: 150 caractères = 1 seconde)
    const duration = text.length / 150;

    return Response.json({
      audio_url: audioUrl,
      duration: duration,
      scene_number: scene_number,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});