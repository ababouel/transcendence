import { Box } from "@react-three/drei";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { player1, player2 } from "../entity/entity";
import { PlayerPosition, match } from "../utils/utils";
import { useSocket } from "@/context/events-socket-context";
import { useUser } from "@/context/user-context";

export interface playerType {
  nmPl: number;
  posi: [x: number, y: number, z: number];
  size: [length: number, width: number, height: number];
  txtu: string;
}

export interface statusType {
  name: string;
}

export function Player(playerProps: playerType) {
  const socket = useSocket();
  const { user } = useUser();
  const player = useRef<THREE.Mesh>(null);
  const arrowLeft = PlayerPosition("ArrowLeft");
  const arrowRight = PlayerPosition("ArrowRight");
  useFrame(() => {
    if (player.current) {
      player.current.position.x = playerProps.posi[0];
      player.current.position.y = playerProps.posi[1];
      player.current.position.z = playerProps.posi[2];
    }
    console.log("user=>", user?.id);
    console.log("player1=>", player1.nmPl);
    console.log("player2=>", player2.nmPl);
    if (user?.id == player1.nmPl) {
      if (arrowLeft) socket?.emit("moveLeft", { match: match });
      if (arrowRight) socket?.emit("moveRight", { match: match });
    }
    if (user?.id == player2.nmPl) {
      if (arrowLeft) socket?.emit("moveRight", { match: match });
      if (arrowRight) socket?.emit("moveLeft", { match: match });
    }
  });
  return (
    <Box ref={player} args={playerProps.size}>
      <meshBasicMaterial color={playerProps.txtu} />
    </Box>
  );
}
