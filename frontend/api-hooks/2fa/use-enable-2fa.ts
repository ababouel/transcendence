import { useToast } from "@/components/ui/use-toast";
import { USER_KEY } from "@/context/user-context";
import { api } from "@/lib/api";
import { getServerMessage } from "@/lib/utils";
import { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";

export const useEnable2fa = () => {
  const { toast } = useToast();
  const { mutate } = useSWRConfig();
  const { trigger, ...rest } = useSWRMutation(
    "/authentication/2fa/enable",
    async (url, { arg: tfaCode }: { arg: string }) => {
      return api.post(url, {
        tfaCode,
      });
    },
    {
      onError: (error) => {
        toast({
          description: getServerMessage(error, "Failed to enable 2FA"),
          variant: "destructive",
        });
      },
      onSuccess: async () => {
        toast({ description: "2FA is enabled" });
        await mutate(USER_KEY);
      },
    },
  );

  return {
    enable2FA: trigger,
    ...rest,
  };
};
