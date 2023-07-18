"use client";

import axios from "axios";
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Socket, io } from "socket.io-client";
import { useUser } from "./user-context";
import {
  FRIEND_CONNECTED,
  FRIEND_DISCONNECTED,
  FriendConnectedData,
  FriendDisconnectedData,
  MESSAGE_EVENT,
  MessageType,
} from "@transcendence/common";
import { useToast } from "@/components/ui/use-toast";
import { ERROR_EVENT } from "@transcendence/common";
import { WsErrorData } from "@transcendence/common";
import { useSWRConfig } from "swr";
import { getMessagesKey } from "@/api-hooks/use-messages";
import { useAtom } from "jotai";
import { connectedFriendsAtom } from "@/stores/connected-users-atom";

const EventsSocketContext = createContext<Socket | null>(null);

export const useSocket = () => useContext(EventsSocketContext);

export const EventsSocketProvider = ({ children }: { children: ReactNode }) => {
  const socket = useSocket_();

  return (
    <EventsSocketContext.Provider value={socket}>
      {children}
    </EventsSocketContext.Provider>
  );
};

function useSocket_() {
  const { user: currentUser } = useUser();
  const [socket, setSocket] = useState<Socket | null>(null);

  const onMessage = useOnMessage();
  const onError = useOnError();
  const onFriendConnected = useOnFriendConnected();
  const onFriendDisconnected = useOnFriendDisconnected();

  useEffect(() => {
    if (!currentUser) return;

    // TODO: user NEXT_PUBLIC_API_URL
    const _socket = io("http://localhost:8080", {
      withCredentials: true,
    });

    if (!_socket.hasListeners("connect")) {
      _socket.on("connect", () => {
        _socket.on(ERROR_EVENT, async (data: WsErrorData) =>
          onError(_socket, data)
        );
        _socket.on(MESSAGE_EVENT, (data: MessageType) => onMessage(data));
        _socket.on(FRIEND_CONNECTED, (data: FriendConnectedData) => {
          onFriendConnected(data);
        });
        _socket.on(FRIEND_DISCONNECTED, (data: FriendDisconnectedData) => {
          onFriendDisconnected(data);
        });
      });
    }

    setSocket(_socket);
  }, [currentUser]);

  return socket;
}

const useOnMessage = () => {
  const { mutate } = useSWRConfig();
  const { user: currentUser } = useUser();

  const onMessage = useCallback(
    (data: MessageType) => {
      if (!currentUser) return;

      const friendId =
        data.recipientId === currentUser.id ? data.senderId : data.recipientId;
      mutate(
        getMessagesKey(friendId),
        (messages) => [...(messages ?? []), data],
        { revalidate: false }
      );
    },
    [currentUser]
  );
  return onMessage;
};

const useOnError = () => {
  const { toast } = useToast();

  const onError = useCallback(async (socket: Socket, data: WsErrorData) => {
    if (data.statusCode !== 401) {
      toast({
        variant: "destructive",
        description: data.message,
      });
      return;
    }
    try {
      // try to refresh tokens
      await axios.post("/api/auth/refresh-tokens");
      setTimeout(() => {
        socket.connect();
      }, 200);
    } catch (error) {}
  }, []);
  return onError;
};

const useOnFriendConnected = () => {
  const [, setConnectedFriends] = useAtom(connectedFriendsAtom);

  const onFriendConnected = useCallback(({ friendId }: FriendConnectedData) => {
    setConnectedFriends(
      (oldFriendsSet) => new Set(oldFriendsSet.add(friendId))
    );
  }, []);
  return onFriendConnected;
};

const useOnFriendDisconnected = () => {
  const [, setConnectedFriends] = useAtom(connectedFriendsAtom);

  const onFriendDisconnected = useCallback(
    ({ friendId }: FriendDisconnectedData) => {
      setConnectedFriends((oldFriendsSet) => {
        oldFriendsSet.delete(friendId);
        return new Set(oldFriendsSet);
      });
    },
    []
  );

  return onFriendDisconnected;
};