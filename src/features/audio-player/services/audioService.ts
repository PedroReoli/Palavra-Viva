import { Audio, AVPlaybackStatus } from 'expo-av';

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

export interface AudioState {
  isPlaying: boolean;
  isLoaded: boolean;
  positionMs: number;
  durationMs: number;
  rate: number;
}

const DEFAULT_STATE: AudioState = {
  isPlaying: false,
  isLoaded: false,
  positionMs: 0,
  durationMs: 0,
  rate: 1.0,
};

const RATES = [0.75, 1.0, 1.25, 1.5, 2.0];

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

let soundInstance: Audio.Sound | null = null;

export const audioService = {
  /**
   * Configura o modo de audio para reproducao em background.
   */
  async configure() {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      shouldDuckAndroid: true,
    });
  },

  /**
   * Carrega e reproduz um audio a partir de uma URI.
   */
  async play(
    uri: string,
    onStatusUpdate: (state: AudioState) => void,
  ): Promise<void> {
    // Limpar audio anterior
    await this.stop();

    const { sound } = await Audio.Sound.createAsync(
      { uri },
      { shouldPlay: true, rate: 1.0, shouldCorrectPitch: true },
      (status: AVPlaybackStatus) => {
        if (!status.isLoaded) return;
        onStatusUpdate({
          isPlaying: status.isPlaying,
          isLoaded: true,
          positionMs: status.positionMillis ?? 0,
          durationMs: status.durationMillis ?? 0,
          rate: status.rate ?? 1.0,
        });
      },
    );

    soundInstance = sound;
  },

  async pause(): Promise<void> {
    if (soundInstance) await soundInstance.pauseAsync();
  },

  async resume(): Promise<void> {
    if (soundInstance) await soundInstance.playAsync();
  },

  async stop(): Promise<void> {
    if (soundInstance) {
      await soundInstance.stopAsync();
      await soundInstance.unloadAsync();
      soundInstance = null;
    }
  },

  async seekTo(positionMs: number): Promise<void> {
    if (soundInstance) await soundInstance.setPositionAsync(positionMs);
  },

  async setRate(rate: number): Promise<void> {
    if (soundInstance) {
      await soundInstance.setRateAsync(rate, true);
    }
  },

  /**
   * Retorna a proxima velocidade no ciclo.
   */
  getNextRate(current: number): number {
    const idx = RATES.indexOf(current);
    return RATES[(idx + 1) % RATES.length];
  },

  getDefaultState(): AudioState {
    return { ...DEFAULT_STATE };
  },
};
