import { DaySessionGroup, Peer, Task, WorkSession } from '../types';
import GroupService from './GroupService';
import TaskService from './TaskService';
import UserService from './UserService';
import WorksessionService from './WorksessionService';

const DELAY = 500; // Simulate network latency 

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  getUser: async () => {
    await delay(DELAY);
  },

  getTasks: async (filter?: 'all' | 'completed' | 'active'): Promise<Task[]> => {
    // Fetch tasks from backend and apply filter client-side
    try {
      const tasks = await TaskService.getTasks();
      if (!filter || filter === 'all') return tasks;
      return tasks.filter(t => (filter === 'completed' ? t.completed : !t.completed));
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return [];
    }
  },

  getSessions: async (dayKey?: string): Promise<WorkSession[]> => {
    try {
      const sessions = await WorksessionService.getWorksessions();
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
      allSessions = await WorksessionService.getWorksessions();
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
    // Fetch peers (users as persons, groups) from backend
    try {
      const [users, groups] = await Promise.all([
        UserService.getUsers(),
        GroupService.getGroups()
      ]);

      let peers: Peer[] = [...users, ...groups];

      if (!typeFilter || typeFilter === 'all') return peers;

      // Temporary handling: treat 'friend' filter as 'person' until friendship feature exists
      const normalizedFilter = typeFilter === 'friend' ? 'person' : typeFilter;
      return peers.filter(p => p.type === normalizedFilter);
    } catch (error) {
      console.error('Error fetching peers:', error);
      return [];
    }
  },

  getSession: async (id: string): Promise<WorkSession | undefined> => {
    try {
      const sessions = await WorksessionService.getWorksessions();
      return sessions.find(s => s.id === id);
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }
};
