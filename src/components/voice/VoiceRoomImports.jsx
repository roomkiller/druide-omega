// Wrapper component for VoiceRoom conditional rendering
export const VoiceRoomConnectionButton = (props) => {
  const VoiceRoomConnectionButtonComponent = require('@/components/voice/VoiceRoomConnectionButton').default;
  return <VoiceRoomConnectionButtonComponent {...props} />;
};

export const VoiceRoomSettingsPanel = (props) => {
  const VoiceRoomSettingsPanelComponent = require('@/components/voice/VoiceRoomSettingsPanel').default;
  return <VoiceRoomSettingsPanelComponent {...props} />;
};