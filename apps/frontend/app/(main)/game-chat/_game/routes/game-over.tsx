import { Button } from "@/components/ui/button";
import { useSocket } from "@/context";
import { ClientGameEvents } from "@transcendence/db";
import { useNavigate } from "react-router";

export function GameOver() {
  const socket = useSocket();
  const navigate = useNavigate();

  const retryAction = () => {
    socket?.emit(ClientGameEvents.JNRNDMCH);
    // Todo: emit event from server
    navigate("/waiting");
  };
  const homeAction = () => {
    navigate("/");
  };
  return (
    <div className="grid h-full place-items-center">
      <div className="space-x-4">
        <Button color={"green"} onClick={retryAction}>
          Retry
        </Button>
        <Button color={"red"} onClick={homeAction}>
          Return
        </Button>
      </div>
    </div>
  );
}
