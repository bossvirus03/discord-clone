export interface UserRes {
    id: string,
    avatarUrl: string,
    badges: string[],
    name: string,
    status: string,
    createdAt: Date,
    updatedAt: Date,
    role: string,
    personalChannelId: string,
    friends: any
}

export interface UserCreationRes {
    id: string,
    avatarUrl: string,
    badges: string[],
    name: string,
    status: string,
    createdAt: Date,
    updatedAt: Date,
    role: string,
    personalChannelId: string
}

export interface UserUpdateRes {
    id: string,
    avatarUrl: string,
    badges: string[],
    name: string,
    status: string,
    createdAt: Date,
    updatedAt: Date,
    role: string,
    personalChannelId: string
}

export interface UserDeleteRes {
    message: string;
}