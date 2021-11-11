import { Context, SessionFlavor } from 'grammy';
import { MinerStats } from './MinerStats';

export interface LastStats {
  date: number
  stats: MinerStats
}

export interface SessionData {
  lastStats: Record<string, LastStats>
}

export type ContextWithSession = Context & SessionFlavor<SessionData>;
