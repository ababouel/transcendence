export const MESSAGE_EVENT = "message";
export const MESSAGE_READ_EVENT = "message_read";

export const ERROR_EVENT = "ws_error";
export type WsErrorData = {
  message: string;
  statusCode?: number;
};

export const FRIEND_CONNECTED = "friend_connected";
export type FriendConnectedData = {
  friendId: number;
};

export const FRIEND_DISCONNECTED = "friend_disconnected";
export type FriendDisconnectedData = FriendConnectedData;

export const FRIEND_REQUEST_EVENT = "friend_request";
export const FRIEND_REQUEST_ACCEPTED_EVENT = "friend_request_accepted";
