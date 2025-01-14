export interface ServerRes {
    id: string;
    name: string;
    iconUrl: string;
    badges: string[];
    ownerId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ServerDeleteRes {
    message: string;
}