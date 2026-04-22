import { Audio } from 'expo-av';
import { readAsStringAsync, EncodingType } from 'expo-file-system/legacy';

export class AudioService {
  private static recording: Audio.Recording | null = null;

  static async startRecording() {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== 'granted') {
        throw new Error('Microphone permission not granted');
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      this.recording = recording;
    } catch (err) {
      console.error('Failed to start recording', err);
      throw err;
    }
  }

  static async stopRecording() {
    if (!this.recording) return null;

    try {
      await this.recording.stopAndUnloadAsync();
      const uri = this.recording.getURI();
      this.recording = null;
      return uri;
    } catch (err) {
      console.error('Failed to stop recording', err);
      throw err;
    }
  }

  static async uriToBase64(uri: string): Promise<string> {
    try {
      const base64 = await readAsStringAsync(uri, {
        encoding: EncodingType.Base64,
      });
      return base64;
    } catch (err) {
      console.error('Failed to convert URI to base64', err);
      throw err;
    }
  }
}
