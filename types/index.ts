export interface User {
  id: {
    value: string;
  };
  username: string;
  email: {
    value: string;
  };
  profile?: Profile;
}
export interface Profile {
  bio: string;
  studyProgram: string;
  yearOfStudy: number;
}
export interface Task {
  id: string;
  title: string;
  deadline: string;
  progress: number;
  completed: boolean;
  pastDue: boolean;
  description?: string;
}

export interface WorkSession {
  id: string;
  taskId?: string; // Links to a task if applicable
  taskTitle: string;
  time: string;
  day: string; // 'Mon', 'Tue', etc.
  ownerId: string;
  ownerName: string;
  isUser: boolean; // True if it belongs to the current user
}

export interface Peer {
  id: string;
  name: string;
  education?: string;
  members?: number;
  type: 'friend' | 'group' | 'person';
}

export interface DaySessionGroup {
  day: string;
  key: string;
  sessions: WorkSession[];
}

export interface BackendUser {
  id: string ;
  username: string;
  email: string ;
  password?: string;       
  profile?: any;            
}

export interface BackendGroup {
  id: string;
  name: string;
  members: {
    userId: string;
    role: string;
  }[];
}