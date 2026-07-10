/**
 * Chiffrement du coffre-fort — AES-256-GCM avec clé dérivée par PBKDF2.
 * Tout se passe dans le navigateur : la phrase secrète ne quitte jamais l'appareil.
 */
const enc = new TextEncoder();
const dec = new TextDecoder();

const toB64 = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf)));
const fromB64 = (str) => Uint8Array.from(atob(str), (c) => c.charCodeAt(0));

async function deriveKey(passphrase, salt) {
  const keyMaterial = await crypto.subtle.importKey(
    'raw', enc.encode(passphrase), 'PBKDF2', false, ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 250000, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encryptText(passphrase, plaintext) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(passphrase, salt);
  const cipher = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(plaintext));
  return { ciphertext: toB64(cipher), iv: toB64(iv), salt: toB64(salt) };
}

export async function decryptText(passphrase, { ciphertext, iv, salt }) {
  const key = await deriveKey(passphrase, fromB64(salt));
  const plain = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: fromB64(iv) }, key, fromB64(ciphertext)
  );
  return dec.decode(plain);
}