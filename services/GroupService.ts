import { BackendGroup, GroupDetail, GroupMember, Peer } from '@/types';
import { API_URL } from './Config';
import { getToken } from './StorageService';

const apiUrl = API_URL;

export function mapGroupToPeer(group: BackendGroup): Peer {
    return {
        id: group.id,
        name: group.name,
        members: group.members.length,
        type: 'group' as const,
    };
}

export function mapGroupsToPeers(groups: BackendGroup[]): Peer[] {
    return groups.map(mapGroupToPeer);
}

const getGroups = async () => {
    const token = await getToken();

    if (!token) {
        throw new Error('No token found, retry login');
    }

    const response = await fetch(apiUrl + '/groups', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Groups error:", errorText);
        throw new Error('Failed to fetch groups');
    }

    const backendGroups = await response.json();
    return mapGroupsToPeers(backendGroups);
};

// Voor later
const createGroup = async () => {
    const response = await fetch(apiUrl + '/groups/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to create group');
    }

    return response.json();
};

// Voor later
const updateGroup = async () => {
    const response = await fetch(apiUrl + '/groups/update', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to update group');
    }

    return response.json();
};

const getGroupById = async (id: string) => {
    const token = await getToken();

    if (!token) {
        throw new Error('No token found, retry login');
    }

    const response = await fetch(apiUrl + '/groups/' + id, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Group error:", errorText);
        throw new Error('Failed to fetch group');
    }

    const backendGroup = await response.json();
    return mapGroupToPeer(backendGroup);
};

const getGroupWithMembers = async (id: string): Promise<GroupDetail> => {
    const token = await getToken();

    if (!token) {
        throw new Error('No token found, retry login');
    }

    const response = await fetch(apiUrl + '/groups/' + id, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Group error:", errorText);
        throw new Error('Failed to fetch group details');
    }

    const backendGroup: BackendGroup = await response.json();
    
    // Fetch user details for each member
    const memberDetails = await Promise.all(
        backendGroup.members.map(async (member) => {
            try {
                const userResponse = await fetch(apiUrl + '/users/' + member.userId, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (userResponse.ok) {
                    const userData = await userResponse.json();
                    return {
                        userId: member.userId,
                        username: userData.username,
                        role: member.role,
                        profilePicture: userData.profilePicture,
                    } as GroupMember;
                }
            } catch (err) {
                console.error('Failed to fetch user details for member', member.userId);
            }

            // Fallback if user details cannot be fetched
            return {
                userId: member.userId,
                username: `User ${member.userId.substring(0, 8)}`,
                role: member.role,
            } as GroupMember;
        })
    );

    return {
        id: backendGroup.id,
        name: backendGroup.name,
        members: memberDetails,
    };
};

const GroupService = {
    getGroups,
    getGroupById,
    getGroupWithMembers,
    createGroup,
    updateGroup,
};

export default GroupService;