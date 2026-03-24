export type SoundChannel = 'master' | 'music' | 'sfx' | 'ambient';

export interface SoundEntry {
  src: string[];
  channel: SoundChannel;
  loop?: boolean;
  volume?: number;
}

export const SOUND_MAP: Record<string, SoundEntry> = {
  // Reel
  spin_start:        { src: ['/audio/sfx/spin_start.mp3'],        channel: 'sfx' },
  spin_loop:         { src: ['/audio/sfx/spin_loop.mp3'],         channel: 'sfx', loop: true, volume: 0.6 },
  reel_stop_1:       { src: ['/audio/sfx/reel_stop_1.mp3'],       channel: 'sfx' },
  reel_stop_2:       { src: ['/audio/sfx/reel_stop_2.mp3'],       channel: 'sfx' },
  reel_stop_3:       { src: ['/audio/sfx/reel_stop_3.mp3'],       channel: 'sfx' },
  reel_stop_4:       { src: ['/audio/sfx/reel_stop_4.mp3'],       channel: 'sfx' },
  reel_stop_5:       { src: ['/audio/sfx/reel_stop_5.mp3'],       channel: 'sfx' },
  reel_anticipation: { src: ['/audio/sfx/reel_anticipation.mp3'], channel: 'sfx' },

  // Wins
  win_small:     { src: ['/audio/sfx/win_small.mp3'],     channel: 'sfx' },
  win_medium:    { src: ['/audio/sfx/win_medium.mp3'],    channel: 'sfx' },
  win_big:       { src: ['/audio/sfx/win_big.mp3'],       channel: 'sfx' },
  win_mega:      { src: ['/audio/sfx/win_mega.mp3'],      channel: 'sfx' },
  win_jackpot:   { src: ['/audio/sfx/win_jackpot.mp3'],   channel: 'sfx', loop: true },
  counter_tick:  { src: ['/audio/sfx/counter_tick.mp3'],  channel: 'sfx', volume: 0.4 },
  counter_end:   { src: ['/audio/sfx/counter_end.mp3'],   channel: 'sfx' },

  // UI
  button_hover:    { src: ['/audio/sfx/button_hover.mp3'],    channel: 'sfx', volume: 0.3 },
  button_press:    { src: ['/audio/sfx/button_press.mp3'],    channel: 'sfx' },
  bet_change:      { src: ['/audio/sfx/bet_change.mp3'],      channel: 'sfx' },
  balance_update:  { src: ['/audio/sfx/balance_update.mp3'],  channel: 'sfx' },

  // Music
  background_music: { src: ['/audio/music/background_music.mp3'], channel: 'music', loop: true, volume: 0.4 },
  bonus_music:      { src: ['/audio/music/bonus_music.mp3'],      channel: 'music', loop: true, volume: 0.5 },
};
