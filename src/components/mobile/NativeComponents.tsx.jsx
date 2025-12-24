/**
 * Native Components Examples - Exemples de composants React Native
 * À utiliser comme référence pour le développement mobile
 */

// ============================================================================
// Example 1: Chat Bubble Component
// ============================================================================

/*
import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface ChatBubbleProps {
  message: string;
  isAI: boolean;
  timestamp: Date;
  consciousness?: number;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ 
  message, 
  isAI, 
  timestamp,
  consciousness 
}) => {
  return (
    <View style={[styles.container, isAI ? styles.aiContainer : styles.userContainer]}>
      {isAI ? (
        <LinearGradient
          colors={['#7c3aed', '#ec4899']}
          style={styles.bubble}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={[styles.text, styles.aiText]}>{message}</Text>
          {consciousness && (
            <Text style={styles.consciousness}>
              Consciousness: {consciousness}/15
            </Text>
          )}
          <Text style={styles.timestamp}>
            {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </LinearGradient>
      ) : (
        <View style={[styles.bubble, styles.userBubble]}>
          <Text style={styles.text}>{message}</Text>
          <Text style={styles.timestamp}>
            {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    marginHorizontal: 16,
    maxWidth: '80%',
  },
  aiContainer: {
    alignSelf: 'flex-start',
  },
  userContainer: {
    alignSelf: 'flex-end',
  },
  bubble: {
    padding: 12,
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  userBubble: {
    backgroundColor: '#1e293b',
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
  },
  aiText: {
    color: '#ffffff',
  },
  consciousness: {
    fontSize: 10,
    color: '#e0e0e0',
    marginTop: 4,
  },
  timestamp: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 4,
    textAlign: 'right',
  },
});
*/

// ============================================================================
// Example 2: Voice Recorder Component
// ============================================================================

/*
import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';

export const VoiceRecorder: React.FC = () => {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const pulseAnim = useState(new Animated.Value(1))[0];

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) return;

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
      setIsRecording(true);

      // Pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    setIsRecording(false);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setRecording(null);
    pulseAnim.setValue(1);

    // Upload to server or process
    console.log('Recording saved to', uri);
  };

  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
        <TouchableOpacity
          style={[styles.button, isRecording && styles.recordingButton]}
          onPress={isRecording ? stopRecording : startRecording}
        >
          <Ionicons
            name={isRecording ? 'stop' : 'mic'}
            size={32}
            color="#ffffff"
          />
        </TouchableOpacity>
      </Animated.View>
      {isRecording && (
        <Text style={styles.recordingText}>Recording...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  button: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#7c3aed',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  recordingButton: {
    backgroundColor: '#ef4444',
  },
  recordingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#ef4444',
    fontWeight: '600',
  },
});
*/

// ============================================================================
// Example 3: Offline Sync Manager
// ============================================================================

/*
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

interface QueueItem {
  id: string;
  type: 'create' | 'update' | 'delete';
  entity: string;
  data: any;
  timestamp: number;
}

class OfflineSyncManager {
  private queue: QueueItem[] = [];
  private isOnline: boolean = true;

  constructor() {
    this.loadQueue();
    this.setupNetworkListener();
  }

  private async loadQueue() {
    const queueData = await AsyncStorage.getItem('offline_queue');
    if (queueData) {
      this.queue = JSON.parse(queueData);
    }
  }

  private async saveQueue() {
    await AsyncStorage.setItem('offline_queue', JSON.stringify(this.queue));
  }

  private setupNetworkListener() {
    NetInfo.addEventListener(state => {
      this.isOnline = state.isConnected ?? false;
      if (this.isOnline) {
        this.processQueue();
      }
    });
  }

  async addToQueue(item: Omit<QueueItem, 'id' | 'timestamp'>) {
    const queueItem: QueueItem = {
      ...item,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };

    this.queue.push(queueItem);
    await this.saveQueue();

    if (this.isOnline) {
      await this.processQueue();
    }
  }

  private async processQueue() {
    while (this.queue.length > 0 && this.isOnline) {
      const item = this.queue[0];
      
      try {
        // Send to server
        await this.syncItem(item);
        this.queue.shift();
        await this.saveQueue();
      } catch (error) {
        console.error('Sync failed:', error);
        break;
      }
    }
  }

  private async syncItem(item: QueueItem) {
    // Implementation depends on your API
    console.log('Syncing item:', item);
  }
}

export const syncManager = new OfflineSyncManager();
*/

// ============================================================================
// Example 4: Biometric Authentication
// ============================================================================

/*
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';

export class BiometricAuth {
  static async isAvailable(): Promise<boolean> {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    return hasHardware && isEnrolled;
  }

  static async authenticate(reason: string = 'Authenticate to continue'): Promise<boolean> {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: reason,
        fallbackLabel: 'Use passcode',
        disableDeviceFallback: false,
      });

      return result.success;
    } catch (error) {
      console.error('Biometric authentication error:', error);
      return false;
    }
  }

  static async saveToken(token: string): Promise<void> {
    await SecureStore.setItemAsync('auth_token', token);
  }

  static async getToken(): Promise<string | null> {
    return await SecureStore.getItemAsync('auth_token');
  }

  static async clearToken(): Promise<void> {
    await SecureStore.deleteItemAsync('auth_token');
  }
}
*/

export {};