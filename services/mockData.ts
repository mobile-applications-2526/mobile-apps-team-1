import { Peer, Task, WorkSession } from '../types';

// export const CURRENT_USER: User = {
//   id: 'u1',
//   name: 'Alex Chen',
//   education: 'Computer Science, KU Leuven',
// };

export const MOCK_TASKS: Task[] = [
  { id: '1', title: 'Complete Database Assignment', deadline: '2026-01-05', progress: 60, completed: false, pastDue: false },
  { id: '2', title: 'Study for Algorithms Exam', deadline: '2026-01-08', progress: 30, completed: false, pastDue: false },
  { id: '3', title: 'Submit Project Proposal', deadline: '2025-12-28', progress: 100, completed: true, pastDue: false },
  { id: '4', title: 'Read Chapter 5-7', deadline: '2025-12-25', progress: 0, completed: false, pastDue: true },
  { id: '5', title: 'Group Presentation Prep', deadline: '2026-01-10', progress: 20, completed: false, pastDue: false },
];

export const MOCK_SESSIONS: WorkSession[] = [
  // Week 1: Dec 23 - Dec 29 (Mon-Sun)
  { id: '1', taskTitle: 'Database Design', time: '09:00 - 11:00', day: '2025-12-23', ownerId: 'u1', ownerName: 'You', isUser: true },
  { id: '2', taskTitle: 'React Native Study', time: '14:00 - 16:00', day: '2025-12-23', ownerId: 'u1', ownerName: 'You', isUser: true },
  { id: '3', taskTitle: 'Algorithm Practice', time: '10:00 - 12:00', day: '2025-12-24', ownerId: 'u1', ownerName: 'You', isUser: true },
  { id: '4', taskTitle: 'Project Meeting', time: '15:00 - 16:30', day: '2025-12-25', ownerId: 'u1', ownerName: 'You', isUser: true },
  { id: '5', taskTitle: 'Code Review', time: '11:00 - 12:30', day: '2025-12-26', ownerId: 'u1', ownerName: 'You', isUser: true },
  { id: '6', taskTitle: 'Weekend Study Session', time: '10:00 - 13:00', day: '2025-12-28', ownerId: 'u1', ownerName: 'You', isUser: true },
  { id: '7', taskTitle: 'Personal Project', time: '14:00 - 17:00', day: '2025-12-29', ownerId: 'u1', ownerName: 'You', isUser: true },

  // Week 2: Dec 30 - Jan 5 (Mon-Sun) - CURRENT WEEK
  { id: '8', taskTitle: 'Sprint Planning', time: '09:00 - 10:30', day: '2025-12-30', ownerId: 'u1', ownerName: 'You', isUser: true },
  { id: '9', taskTitle: 'Backend Development', time: '13:00 - 16:00', day: '2025-12-31', ownerId: 'u1', ownerName: 'You', isUser: true },
  { id: '10', taskTitle: 'Testing & QA', time: '10:00 - 12:00', day: '2026-01-01', ownerId: 'u1', ownerName: 'You', isUser: true },
  { id: '11', taskTitle: 'Documentation', time: '14:00 - 16:00', day: '2026-01-02', ownerId: 'u1', ownerName: 'You', isUser: true },
  { id: '12', taskTitle: 'Team Sync', time: '11:00 - 12:00', day: '2026-01-03', ownerId: 'u1', ownerName: 'You', isUser: true },
  { id: '13', taskTitle: 'Hackathon Prep', time: '09:00 - 18:00', day: '2026-01-04', ownerId: 'u1', ownerName: 'You', isUser: true },

  // Week 3: Jan 6 - Jan 12 (Mon-Sun)
  { id: '14', taskTitle: 'Exam Preparation', time: '08:00 - 12:00', day: '2026-01-06', ownerId: 'u1', ownerName: 'You', isUser: true },
  { id: '15', taskTitle: 'Study Group', time: '14:00 - 17:00', day: '2026-01-07', ownerId: 'u1', ownerName: 'You', isUser: true },
  { id: '16', taskTitle: 'Practice Problems', time: '10:00 - 13:00', day: '2026-01-08', ownerId: 'u1', ownerName: 'You', isUser: true },
  { id: '17', taskTitle: 'Mock Exam', time: '09:00 - 12:00', day: '2026-01-09', ownerId: 'u1', ownerName: 'You', isUser: true },
  { id: '18', taskTitle: 'Final Review', time: '13:00 - 16:00', day: '2026-01-10', ownerId: 'u1', ownerName: 'You', isUser: true },
  { id: '19', taskTitle: 'Relaxation Day', time: '10:00 - 12:00', day: '2026-01-11', ownerId: 'u1', ownerName: 'You', isUser: true },

  // Peer sessions across weeks
  { id: '20', taskTitle: 'Linear Algebra Study', time: '10:00 - 12:00', day: '2025-12-23', ownerId: 'p1', ownerName: 'Emma Johnson', isUser: false },
  { id: '21', taskTitle: 'Web Dev Project', time: '14:00 - 17:00', day: '2025-12-23', ownerId: 'p2', ownerName: 'Lucas Van Der Berg', isUser: false },
  { id: '22', taskTitle: 'Database Assignment', time: '09:00 - 11:00', day: '2025-12-24', ownerId: 'p1', ownerName: 'Emma Johnson', isUser: false },
  { id: '23', taskTitle: 'ML Study Group', time: '13:00 - 15:00', day: '2025-12-24', ownerId: 'g1', ownerName: 'CS Study Group', isUser: false },
  { id: '24', taskTitle: 'UI Design', time: '16:00 - 18:00', day: '2025-12-24', ownerId: 'p3', ownerName: 'Sophie Martinez', isUser: false },
  { id: '25', taskTitle: 'Algorithms Practice', time: '10:00 - 12:00', day: '2025-12-25', ownerId: 'p2', ownerName: 'Lucas Van Der Berg', isUser: false },
  { id: '26', taskTitle: 'Group Presentation Prep', time: '14:00 - 16:00', day: '2025-12-26', ownerId: 'g1', ownerName: 'CS Study Group', isUser: false },
  { id: '27', taskTitle: 'Python Workshop', time: '15:00 - 17:00', day: '2025-12-26', ownerId: 'p1', ownerName: 'Emma Johnson', isUser: false },
  { id: '28', taskTitle: 'Weekend Coding', time: '11:00 - 14:00', day: '2025-12-28', ownerId: 'p2', ownerName: 'Lucas Van Der Berg', isUser: false },
  { id: '29', taskTitle: 'Game Dev Session', time: '15:00 - 18:00', day: '2025-12-29', ownerId: 'p3', ownerName: 'Sophie Martinez', isUser: false },
  { id: '30', taskTitle: 'AI Workshop', time: '10:00 - 13:00', day: '2025-12-31', ownerId: 'g1', ownerName: 'CS Study Group', isUser: false },
  { id: '31', taskTitle: 'Code Review Session', time: '14:00 - 16:00', day: '2026-01-01', ownerId: 'p1', ownerName: 'Emma Johnson', isUser: false },
  { id: '32', taskTitle: 'Hackathon', time: '10:00 - 19:00', day: '2026-01-04', ownerId: 'g1', ownerName: 'CS Study Group', isUser: false },
  { id: '33', taskTitle: 'Sunday Brunch & Code', time: '11:00 - 14:00', day: '2026-01-05', ownerId: 'p2', ownerName: 'Lucas Van Der Berg', isUser: false },
  { id: '34', taskTitle: 'Exam Study Group', time: '09:00 - 12:00', day: '2026-01-06', ownerId: 'g1', ownerName: 'CS Study Group', isUser: false },
  { id: '35', taskTitle: 'Peer Review', time: '13:00 - 15:00', day: '2026-01-08', ownerId: 'p1', ownerName: 'Emma Johnson', isUser: false },
  { id: '36', taskTitle: 'Weekend Study', time: '10:00 - 13:00', day: '2026-01-11', ownerId: 'p3', ownerName: 'Sophie Martinez', isUser: false },
];

export const MOCK_PEERS: Peer[] = [
  { id: 'p1', name: 'Emma Johnson', education: 'Computer Science, KU Leuven', type: 'friend' },
  { id: 'p2', name: 'Lucas Van Der Berg', education: 'Software Engineering, KU Leuven', type: 'friend' },
  { id: 'p3', name: 'Sophie Martinez', education: 'Computer Science, KU Leuven', type: 'friend' },
  { id: 'g1', name: 'CS Study Group', members: 12, type: 'group' },
  { id: 'g2', name: 'Database Project Team', members: 4, type: 'group' },
  { id: 'g3', name: 'Algorithms Study Circle', members: 8, type: 'group' },
];


