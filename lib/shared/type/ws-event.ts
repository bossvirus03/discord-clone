import { SendFriendRequestDto } from '../dto/friend/friend-request.dto';

export interface FriendPresenceActivePayload {
  userId: string;
  isActive: boolean;
}

export interface ServerToClientEvents {
  message: (payload: {
    senderId: string;
    receiverId: string;
    content: string;
  }) => void;
  // friend_request: (payload: SendFriendRequestDto) => void;
  // friend_presence_active: (payload: FriendPresenceActivePayload) => void;
  // friend_request_accepted: (payload: SendFriendRequestDto) => void;
  // friend_request_rejected: (payload: SendFriendRequestDto) => void;
}
