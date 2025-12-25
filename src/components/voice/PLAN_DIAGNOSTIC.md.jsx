# 🔍 PLAN DE DIAGNOSTIC - VoiceRoom Silent Bug

## Date: 2025-12-25
## Problème: Druide Omega ne répond pas vocalement sur mobile (Samsung S20)

---

## PHASE 1: VÉRIFICATION CAPTURE VOCALE ✅
**Objectif**: Confirmer que la voix est bien captée

### Tests à effectuer:
- [ ] Vérifier que `transcript` contient du texte après avoir parlé
- [ ] Confirmer que `handleUserSpeech()` est appelé
- [ ] Vérifier les logs: "📝 Texte reçu: [texte]"

### Indicateurs de succès:
- ✅ Les logs montrent le transcript capturé
- ✅ `handleUserSpeech()` apparaît dans les logs

**Statut actuel**: ✅ FONCTIONNE (d'après les logs)

---

## PHASE 2: VÉRIFICATION APPEL LLM 🔄
**Objectif**: Confirmer que le LLM génère une réponse

### Tests à effectuer:
- [ ] Vérifier log "📞 Appel LLM direct..."
- [ ] Vérifier log "✅ LLM OK:" avec réponse
- [ ] Confirmer que `aiResponse` n'est pas vide
- [ ] Vérifier que pas d'erreur "❌ LLM ERREUR"

### Code concerné:
```javascript
// Ligne 1154-1162 VoiceRoom
const aiResponse = await base44.integrations.Core.InvokeLLM({
  prompt: simplePrompt,
  add_context_from_internet: false
});
console.log('✅ LLM OK:', aiResponse);
```

### Indicateurs de succès:
- ✅ Log "✅ LLM OK:" visible avec du texte
- ✅ Pas de catch d'erreur LLM

**Statut à vérifier**: ⚠️ EN COURS

---

## PHASE 3: VÉRIFICATION APPEL TTS 🔊
**Objectif**: Confirmer que `speak()` est appelé et exécuté

### Tests à effectuer:
- [ ] Vérifier log "🔊 LECTURE VOCALE MOBILE"
- [ ] Vérifier log "🎤 Appel speak()..."
- [ ] Vérifier log "✅ speak() OK"
- [ ] Confirmer absence de "❌ TTS ERREUR"

### Code concerné:
```javascript
// Ligne 1181-1189 VoiceRoom
try {
  console.log('🎤 Appel speak()...');
  await speak(aiResponse, 'fr-FR');
  console.log('✅ speak() OK');
  setStatusMessage("✅ Terminé");
} catch (ttsErr) {
  console.error('❌ TTS ERREUR:', ttsErr);
  setStatusMessage("❌ Erreur vocale");
}
```

### Indicateurs de succès:
- ✅ Log "🎤 Appel speak()..." visible
- ✅ Log "✅ speak() OK" visible
- ❌ Pas de log "❌ TTS ERREUR"

**Statut à vérifier**: ⚠️ CRITIQUE

---

## PHASE 4: VÉRIFICATION MobileTTS 🎙️
**Objectif**: Confirmer que MobileTTS.speak() fonctionne

### Tests à effectuer:
- [ ] Vérifier log "🔊 speak() APPELÉ"
- [ ] Vérifier log "✅ TTS STARTED"
- [ ] Vérifier log "✅ TTS ENDED"
- [ ] Confirmer que `mobileTTS.speak()` n'échoue pas

### Code concerné:
```javascript
// Ligne 300-314 VoiceRoom (nouveau code avec logs)
await mobileTTS.speak(text, {
  lang,
  onStart: () => {
    console.log('✅ TTS STARTED');
    setIsSpeakingMobile(true);
  },
  onEnd: () => {
    console.log('✅ TTS ENDED');
    setIsSpeakingMobile(false);
  }
});
```

### Indicateurs de succès:
- ✅ Log "✅ TTS STARTED" visible
- ✅ Log "✅ TTS ENDED" visible après quelques secondes
- ✅ Audio audible

**Statut à vérifier**: ⚠️ CRITIQUE - PROBABLE SOURCE DU BUG

---

## PHASE 5: VÉRIFICATION PERMISSIONS NAVIGATEUR 🔐
**Objectif**: Confirmer autorisations microphone et audio

### Tests à effectuer:
- [ ] Vérifier permissions microphone (Settings > Site settings)
- [ ] Vérifier permissions audio/speakers
- [ ] Tester dans Chrome vs Safari
- [ ] Vérifier volume appareil
- [ ] Désactiver "Do Not Disturb" mode

### Indicateurs de succès:
- ✅ Microphone autorisé
- ✅ Audio sortie activée
- ✅ Volume > 50%

**Statut à vérifier**: ⚠️ À TESTER

---

## PHASE 6: TEST AUDIO NATIF 🔊
**Objectif**: Tester synthèse vocale native du navigateur

### Test simple à faire:
```javascript
// Dans console développeur Chrome mobile:
const utterance = new SpeechSynthesisUtterance("Test audio");
utterance.lang = "fr-FR";
speechSynthesis.speak(utterance);
```

### Indicateurs de succès:
- ✅ Audio joue immédiatement
- ✅ Pas d'erreur console

**Statut à vérifier**: ⚠️ TEST CRITIQUE

---

## RÉSUMÉ DES LOGS À SURVEILLER

### Succès complet devrait montrer:
```
🎯 handleUserSpeech APPELÉ
📝 Texte reçu: [votre message]
📱 Mobile: true
✅✅✅ DÉMARRAGE TRAITEMENT MESSAGE: [votre message]
🚀🚀🚀 MODE MOBILE ULTRA-SIMPLIFIÉ
📞 Appel LLM direct...
📋 Prompt: [prompt]
✅ LLM OK: [réponse]
💬 Réponse prête
═══════════════════════════════════════════
🔊 LECTURE VOCALE MOBILE
📝 Texte: [réponse]
═══════════════════════════════════════════
🔊 Druide parle...
🎤 Appel speak()...
═══════════════════════════════════════════
🔊 speak() APPELÉ
📱 Mobile: true
📝 Texte: [réponse]
🌐 Langue: fr-FR
═══════════════════════════════════════════
✅ TTS STARTED
✅ TTS ENDED
✅ speak() TERMINÉ
✅ speak() OK
✅ Terminé
🏁 FIN traitement mobile
```

---

## PROCHAINES ÉTAPES

1. **Collecter les logs console** de l'appareil mobile
2. **Identifier** quelle phase échoue (probablement Phase 4 ou 6)
3. **Passer au PLAN DE RÉPARATION** une fois le problème identifié

---

**Note importante**: Le bug est probablement dans MobileTTS.speak() ou permissions audio natives du navigateur mobile.