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

export interface ServerPermissionRes {
    id: string;
    name: string;
    description: string;
    apiPath: string;
    method: string;
    createdAt?: Date;
    updatedAt?: Date;
    userId: string;
    serverId: string;
}

export interface ServerPermissionDeleteRes {
    message: string;
}