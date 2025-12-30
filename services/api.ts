import { DaySessionGroup, Peer, Task, WorkSession } from '../types';
import { CURRENT_USER, MOCK_PEERS, MOCK_SESSIONS, MOCK_TASKS, MOCK_WEEK_DAYS } from './mockData';

const DELAY = 500; // Simulate network latency

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  getUser: async () => {
    await delay(DELAY);
    return CURRENT_USER;
  },

  getTasks: async (filter?: 'all' | 'completed' | 'active'): Promise<Task[]> => {
    await delay(DELAY);
    if (!filter || filter === 'all') return MOCK_TASKS;
    return MOCK_TASKS.filter(t => filter === 'completed' ? t.completed : !t.completed);
  },

  getSessions: async (dayKey?: string): Promise<WorkSession[]> => {
    await delay(DELAY);
    if (!dayKey) return MOCK_SESSIONS;
    return MOCK_SESSIONS.filter(s => s.day === dayKey);
  },

  getWeekSchedule: async (): Promise<DaySessionGroup[]> => {
      await delay(DELAY);
      return MOCK_WEEK_DAYS.map(d => {
          const sessions = MOCK_SESSIONS.filter(s => s.day === d.key);
          return {
              day: d.day,
              key: d.key,
              sessions
          };
      });
  },

  getPeers: async (typeFilter?: 'all' | 'friend' | 'group'): Promise<Peer[]> => {
    await delay(DELAY);
    if (!typeFilter || typeFilter === 'all') return MOCK_PEERS;
    return MOCK_PEERS.filter(p => p.type === typeFilter);
  },

  getSession: async (id: string): Promise<WorkSession | undefined> => {
    await delay(DELAY);
    return MOCK_SESSIONS.find(s => s.id === id);
  }
};
