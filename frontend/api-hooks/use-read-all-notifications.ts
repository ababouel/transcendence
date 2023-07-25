import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";
import { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";
import { notificationsKey } from "./use-notifications";

export const useReadAllNotifications = () => {
  const { toast } = useToast();
  const { mutate } = useSWRConfig();
  const { trigger, ...rest } = useSWRMutation(
    "/notifications/read-all",
    async (url) => api.patch(url),
    {
      onError: (_error) => {
        toast({
          description: "Failed to read all notifications",
          variant: "destructive",
        });
      },
      onSuccess: () => {
        mutate(notificationsKey);
      },
    }
  );

  return {
    ...rest,
    trigger: () => trigger().catch((_err) => {}),
  };
};