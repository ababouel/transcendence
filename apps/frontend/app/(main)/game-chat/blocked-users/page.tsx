"use client";

import { useBlockedUsers } from "@/api-hooks/use-blocked-users";
import { useUnblockUser } from "@/api-hooks/use-unblock-user";
import { LoaderButton } from "@/components/ui/loader-button";
import UserItem from "../components/user-item";
import FullPlaceHolder from "@/components/ui/full-placeholder";
import GoBackBtn from "../components/chat-go-back";

export default function BlockedUsersPage() {
  const { data: blockedUsers } = useBlockedUsers();
  return (
    <>
      <GoBackBtn>
        <h3>Blocked Users</h3>
      </GoBackBtn>
      <div className="h-full space-y-4 px-5">
        {blockedUsers?.length ? (
          blockedUsers?.map((user) => (
            <UserItem key={user.id} user={user} isBlocked={true}>
              <UnblockUserBtn userId={user.id} />
            </UserItem>
          ))
        ) : (
          <FullPlaceHolder text="No blocked user found" />
        )}
      </div>
    </>
  );
}

type UnblockUserBtnProps = {
  userId: number;
};
function UnblockUserBtn({ userId }: UnblockUserBtnProps) {
  const { trigger: unblockUser, isMutating } = useUnblockUser(userId);
  return (
    <LoaderButton
      title="accept"
      variant="ghost"
      className="h-8"
      isLoading={isMutating}
      onClick={unblockUser}
    >
      <span>Unblock</span>
    </LoaderButton>
  );
}
