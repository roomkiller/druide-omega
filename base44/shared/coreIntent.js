/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║ INTENTION — trier avant de dépenser                                   ║
 * ║ Le tri se fait sur des expressions régulières locales : aucun appel,   ║
 * ║ aucun crédit. C'est ce qui permet aux échanges courts de répondre en   ║
 * ║ quelques centaines de millisecondes au lieu de plusieurs secondes.     ║
 * ║                                                                        ║
 * ║ Quatre destinations :                                                  ║
 * ║   converser    → composeur de mémoire seul (pipeline court-circuité)   ║
 * ║   introspecter → moteur d'introspection (pipeline allégé)              ║
 * ║   clarifier    → question de retour immédiate (zéro module)            ║
 * ║   approfondir  → pipeline cognitif complet                             ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 */

/**
 * Fil de conversation : les 6 derniers échanges, injectés dans le prompt.
 * Sans ça, chaque message est traité comme un premier message — « et pourquoi ? »
 * repartirait de zéro.
 */
export function buildHistory(conversationHistory, userMessage) {
  const historyTurns = (conversationHistory || [])
    .filter((m) => m?.content && (m.role === 'user' || m.role === 'assistant'))
    // Le front envoie l'historique AVEC le message courant en dernier — on l'enlève.
    .filter((m) => !(m.role === 'user' && String(m.content).trim() === String(userMessage || '').trim()))
    .slice(-6);

  const historyBlock = historyTurns.length > 0
    ? historyTurns.map((m) => `${m.role === 'user' ? 'Humain' : 'Toi'} : ${String(m.content).slice(0, 300)}`).join('\n')
    : '';

  return { historyTurns, historyBlock };
}

/** Classe le message dans l'un des quatre buckets d'intention. */
export function classifyIntent(userMessage, historyTurns = []) {
  const normMsg = String(userMessage).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  const wordCount = normMsg.split(/\s+/).filter(Boolean).length;

  // — CONVERSER : salutations, accusés, relances, transitions, messages courts —
  const isGreeting = /^(bonjour|salut|coucou|hey|hello|bonsoir|cc)\b/i.test(normMsg);
  const isAcknowledgment = /^(oui|non|d.accord|ok|compris|je vois|c.est interessant|entendu|bien sur|exact|c.est ca|volontiers|parfait|genial|super|cool)\b/i.test(normMsg) && wordCount <= 3;
  const isFollowUp = /^(et alors|pourquoi|continue|dis m.en plus|dis plus|ensuite|apres|du coup|comment ca|qu.est.ce que tu veux dire|tu peux preciser|explique toi|qu.entends tu|et donc)\b/i.test(normMsg) && wordCount <= 4;
  const isTransition = /^(parlons de|a propos de|changeons de sujet|si on parlait de|je veux parler de|revenons a|au fait|en passant)\b/i.test(normMsg);
  const isConversational = isGreeting || isAcknowledgment || isFollowUp || isTransition;

  // — INTROSPECTER : questions sur Druide lui-même —
  const isIntrospective = /^(qui es.tu|tu es qui|ton nom|comment tu t.appelles|que peux tu faire|tes capacites|ton etat|comment tu vas|tu sens quoi|ta conscience|ton niveau|tu penses quoi de toi|parle moi de toi|presente toi|druide omega)\b/i.test(normMsg);

  // — CLARIFIER : intention trop vague —
  const isTooVague = wordCount <= 2 && !isConversational && !isIntrospective
    && !/^(qu|comment|pourquoi|est.ce|peux.tu|veux.tu|je|tu|nous|on|cela|ca|ce|le|la|un|une|des|du|au|aux)\b/i.test(normMsg);

  // Les relances (« pourquoi ? », « continue », « et donc ») dépendent du fil :
  // dès qu'un historique existe, elles NE doivent PAS court-circuiter le
  // pipeline — sinon elles répondent à côté. Elles tombent alors dans le
  // pipeline complet, qui reçoit l'historique.
  const canBypassConversational = isConversational && !(isFollowUp && historyTurns.length > 0);

  const bucket = canBypassConversational ? 'converser'
    : isIntrospective ? 'introspecter'
    : isTooVague ? 'clarifier'
    : 'approfondir';

  return { bucket, normMsg, wordCount };
}