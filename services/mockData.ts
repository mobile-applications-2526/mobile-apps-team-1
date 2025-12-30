import { Peer, Task, User, WorkSession } from '../types';

export const CURRENT_USER: User = {
  id: 'u1',
  name: 'Alex Chen',
  education: 'Computer Science, KU Leuven',
};

export const MOCK_TASKS: Task[] = [
  { id: '1', title: 'Complete Database Assignment', deadline: '2025-01-05', progress: 60, completed: false, pastDue: false },
  { id: '2', title: 'Study for Algorithms Exam', deadline: '2025-01-08', progress: 30, completed: false, pastDue: false },
  { id: '3', title: 'Submit Project Proposal', deadline: '2024-12-28', progress: 100, completed: true, pastDue: false },
  { id: '4', title: 'Read Chapter 5-7', deadline: '2024-12-25', progress: 0, completed: false, pastDue: true },
  { id: '5', title: 'Group Presentation Prep', deadline: '2025-01-10', progress: 20, completed: false, pastDue: false },
];

export const MOCK_SESSIONS: WorkSession[] = [
    { id: '1', taskTitle: 'Database Design', time: '09:00 - 11:00', day: 'Mon', ownerId: 'u1', ownerName: 'You', isUser: true },
    { id: '2', taskTitle: 'React Native Study', time: '14:00 - 16:00', day: 'Mon', ownerId: 'u1', ownerName: 'You', isUser: true },
    { id: '3', taskTitle: 'Algorithm Practice', time: '10:00 - 12:00', day: 'Tue', ownerId: 'u1', ownerName: 'You', isUser: true },
    { id: '4', taskTitle: 'Project Meeting', time: '15:00 - 16:30', day: 'Wed', ownerId: 'u1', ownerName: 'You', isUser: true },
    // Peers
    { id: '5', taskTitle: 'Linear Algebra Study', time: '10:00 - 12:00', day: 'Mon', ownerId: 'p1', ownerName: 'Emma Johnson', isUser: false },
    { id: '6', taskTitle: 'Web Dev Project', time: '14:00 - 17:00', day: 'Mon', ownerId: 'p2', ownerName: 'Lucas Van Der Berg', isUser: false },
    { id: '7', taskTitle: 'Database Assignment', time: '09:00 - 11:00', day: 'Tue', ownerId: 'p1', ownerName: 'Emma Johnson', isUser: false },
    { id: '8', taskTitle: 'ML Study Group', time: '13:00 - 15:00', day: 'Tue', ownerId: 'g1', ownerName: 'CS Study Group', isUser: false },
    { id: '9', taskTitle: 'UI Design', time: '16:00 - 18:00', day: 'Tue', ownerId: 'p3', ownerName: 'Sophie Martinez', isUser: false },
    { id: '10', taskTitle: 'Algorithms Practice', time: '10:00 - 12:00', day: 'Wed', ownerId: 'p2', ownerName: 'Lucas Van Der Berg', isUser: false },
    { id: '11', taskTitle: 'Group Presentation Prep', time: '14:00 - 16:00', day: 'Thu', ownerId: 'g1', ownerName: 'CS Study Group', isUser: false },
    { id: '12', taskTitle: 'Python Workshop', time: '15:00 - 17:00', day: 'Thu', ownerId: 'p1', ownerName: 'Emma Johnson', isUser: false },
];

export const MOCK_PEERS: Peer[] = [
    { id: 'p1', name: 'Emma Johnson', education: 'Computer Science, KU Leuven', type: 'friend' },
    { id: 'p2', name: 'Lucas Van Der Berg', education: 'Software Engineering, KU Leuven', type: 'friend' },
    { id: 'p3', name: 'Sophie Martinez', education: 'Computer Science, KU Leuven', type: 'friend' },
    { id: 'g1', name: 'CS Study Group', members: 12, type: 'group' },
    { id: 'g2', name: 'Database Project Team', members: 4, type: 'group' },
    { id: 'g3', name: 'Algorithms Study Circle', members: 8, type: 'group' },
];

export const MOCK_WEEK_DAYS = [
    { day: 'Monday, 30 December', key: 'Mon' },
    { day: 'Tuesday, 31 December', key: 'Tue' },
    { day: 'Wednesday, 1 January', key: 'Wed' },
    { day: 'Thursday, 2 January', key: 'Thu' },
    { day: 'Friday, 3 January', key: 'Fri' }
];
