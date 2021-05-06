export interface ClientOptions {
  id: string;
  token: string;
  clientId: string;
  clientSecret: string;
  host: string;
  password: string;
  identifier: string;
  albumLimit: number;
  playlistLimit: number;
  convertUnresolved: boolean;
  selfDeafen: boolean;
  retryDelay?: number;
}
