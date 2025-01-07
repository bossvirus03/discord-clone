import { SendFriendRequestDto } from '../dto/friend/friend-request.dto';
import {
  CreateDirectMessageDto,
  CreateServerMessageDto,
} from '../dto/message/create-message.dto';

export interface FriendPresenceActivePayload {
  userId: string;
  isActive: boolean;
}

export interface ServerToClientEvents {
  direct_message: (payload: CreateDirectMessageDto) => void;
  server_message: (payload: CreateServerMessageDto) => void;
  friend_request: (payload: SendFriendRequestDto) => void;
  friend_presence_active: (payload: FriendPresenceActivePayload) => void;
  // friend_request_accepted: (payload: SendFriendRequestDto) => void;
  // friend_request_rejected: (payload: SendFriendRequestDto) => void;
}
