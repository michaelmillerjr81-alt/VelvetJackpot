import { Howl, Howler } from 'howler';
import { SOUND_MAP } from '../config/soundMap.ts';
import type { SoundChannel } from '../config/soundMap.ts';

class AudioManager {
  private sounds = new Map<string, Howl>();
  private channelVolumes: Record<SoundChannel, number> = {
    master: 1.0,
    music:  0.4,
    sfx:    1.0,
    ambient: 0.3,
  };
  private initialized = false;

  init(): void {
    if (this.initialized) return;
    for (const [key, entry] of Object.entries(SOUND_MAP)) {
      const howl = new Howl({
        src: entry.src,
        loop: entry.loop ?? false,
        volume: (entry.volume ?? 1.0) * this.channelVolumes[entry.channel],
      });
      this.sounds.set(key, howl);
    }
    this.initialized = true;
  }

  play(key: string): number {
    const sound = this.sounds.get(key);
    if (!sound) return -1;
    return sound.play();
  }

  stop(key: string): void {
    this.sounds.get(key)?.stop();
  }

  setChannelVolume(channel: SoundChannel, volume: number): void {
    this.channelVolumes[channel] = volume;
    for (const [key, entry] of Object.entries(SOUND_MAP)) {
      if (entry.channel === channel) {
        const baseVol = entry.volume ?? 1.0;
        this.sounds.get(key)?.volume(baseVol * volume * this.channelVolumes.master);
      }
    }
  }

  duck(channel: SoundChannel, targetVolume: number, durationMs: number): void {
    const start = this.channelVolumes[channel];
    const startTime = performance.now();
    const step = () => {
      const t = Math.min((performance.now() - startTime) / durationMs, 1);
      this.setChannelVolume(channel, start + (targetVolume - start) * t);
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  setMasterVolume(volume: number): void {
    this.channelVolumes.master = volume;
    Howler.volume(volume);
  }
}

export const audioManager = new AudioManager();
