import { DaySessionGroup, Peer, Task, WorkSession } from '../types';
import { MOCK_PEERS, MOCK_TASKS } from './mockData';
import WorksessionService from './WorksessionService';

const DELAY = 500; // Simulate network latency 

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  getUser: async () => {
    await delay(DELAY);
  },

  getTasks: async (filter?: 'all' | 'completed' | 'active'): Promise<Task[]> => {
    await delay(DELAY);
    if (!filter || filter === 'all') return MOCK_TASKS;
    return MOCK_TASKS.filter(t => filter === 'completed' ? t.completed : !t.completed);
  },

  getSessions: async (dayKey?: string): Promise<WorkSession[]> => {
    try {
      const sessions = await WorksessionService.getMyWorksessions();
      if (!dayKey) return sessions;
      return sessions.filter(s => s.day === dayKey);
    } catch (error) {
      console.error("Error fetching sessions:", error);
      return [];
    }
  },

  getWeekSchedule: async (date: Date = new Date()): Promise<DaySessionGroup[]> => {
    // Fetch all sessions first
    let allSessions: WorkSession[] = [];
    try {
      allSessions = await WorksessionService.getMyWorksessions();
    } catch (error) {
      console.error("Error fetching sessions in getWeekSchedule:", error);
      // Fallback to empty or could throw
    }

    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);

    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const current = new Date(startOfWeek);
      current.setDate(startOfWeek.getDate() + i);

      const key = current.toISOString().split('T')[0];
      const dayName = current.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

      weekDays.push({
        day: dayName,
        key: key,
      });
    }

    return weekDays.map(d => {
      const sessions = allSessions
        .filter(s => s.day === d.key)
        .sort((a, b) => a.startTime.localeCompare(b.startTime));
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
    try {
      const sessions = await WorksessionService.getMyWorksessions();
      return sessions.find(s => s.id === id);
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }
};
