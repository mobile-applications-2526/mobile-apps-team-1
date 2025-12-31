import { BackendUser, Peer } from '@/types';
import { getToken } from './StorageService';

const apiUrl = "http://cedvinvu.be/users";

export function mapUserToPeer(backendUser: BackendUser, type: 'friend' | 'group' | 'person', members?: number): Peer {
  const name = backendUser.profile?.displayName || backendUser.username;

  return {
    id: backendUser.id,
    name,
    education: backendUser.profile?.education,
    members: type === 'group' ? members : undefined,
    type,
  };
}

export function mapUsersToPeers(
  backendUsers: BackendUser[],
  type: 'friend' | 'group' | 'person',
  membersPerGroup?: number[]
): Peer[] {
  return backendUsers.map((user, index) => {
    const members = type === 'group' && membersPerGroup ? membersPerGroup[index] : undefined;
    return mapUserToPeer(user, type, members);
  });
}

const getUsers = async () => {
    const token = await getToken();
            
    if (!token) {
        throw new Error('Geen token gevonden, log opnieuw in niffo');
    }

    const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Users error:", errorText);
        throw new Error('Failed to fetch users lmao');
    }

    const data = await response.json();
    console.log(data);
    return mapUsersToPeers(data, 'person');
};


const getUserById = async (id: string) => {
    const token = await getToken(); // make sure this returns the JWT
    const response = await fetch(`${apiUrl}/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    });

    const data = await response.json();

    if (!response.ok) {
        const errorMessage = data?.NotFoundException || data?.error || 'Failed to fetch user';
        throw new Error(errorMessage);
    }

    return data;
};


const UserService = {
    getUsers,
    getUserById,
};

export default UserService;
