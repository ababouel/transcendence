import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { MessageCircle, MessageSquare, MessagesSquare } from "lucide-react";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};
export default function GameLayout({ children }: Props) {
  const chatPopup = (
    <div className="flex h-full w-full flex-col space-y-10 rounded-md bg-chat p-4 pt-10 text-chat-foreground/70 md:shadow-sm">
      {children}
    </div>
  );

  return (
    <div className="h-full space-y-10">
      <Dialog modal={false}>
        <DialogTrigger asChild>
          <Button variant="outline" className="md:hidden">
            <MessagesSquare />
          </Button>
        </DialogTrigger>
        <DialogContent className="mt-2 h-[98vh] w-[96vw] overflow-hidden rounded-md border-0 border-transparent bg-chat">
          <div className="h-full overflow-y-hidden">{chatPopup}</div>
        </DialogContent>
      </Dialog>
      <div className="h-full space-x-4 md:flex">
        <div className="flex h-full flex-grow items-center justify-center rounded-md bg-chat text-3xl font-light text-chat-foreground/40">
          Game
        </div>
        <div className="hidden h-full w-full overflow-y-hidden md:block md:max-w-sm">
          {chatPopup}
        </div>
      </div>
    </div>
  );
}
