export interface OP {
  textChannel: string | null;
  voiceChannel: string | null;
  state: string;
  position: number;
  volume: number;
  paused: boolean;
  playing: boolean;
  trackRepeat: boolean;
  queueRepeat: boolean;
  queue: object;
  voiceState: object;
}
