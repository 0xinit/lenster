import { Leafwatch } from "@helpers/leafwatch";
import { PROFILE } from "@hey/data/tracking";
import getAccount from "@hey/helpers/getAccount";
import type { Profile } from "@hey/lens";
import { Button, Modal } from "@hey/ui";
import type { FC } from "react";
import { useState } from "react";
import { useGlobalModalStateStore } from "src/store/non-persisted/useGlobalModalStateStore";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import Slug from "../../Slug";
import FollowModule from "./FollowModule";

interface SuperFollowProps {
  buttonClassName: string;
  profile: Profile;
  small: boolean;
  title: string;
}

const SuperFollow: FC<SuperFollowProps> = ({
  buttonClassName,
  profile,
  small,
  title
}) => {
  const [showFollowModal, setShowFollowModal] = useState(false);
  const { currentAccount } = useAccountStore();
  const { setShowAuthModal } = useGlobalModalStateStore();

  return (
    <>
      <Button
        aria-label={title}
        className={buttonClassName}
        onClick={() => {
          if (!currentAccount) {
            setShowAuthModal(true);
            return;
          }
          setShowFollowModal(!showFollowModal);
          Leafwatch.track(PROFILE.OPEN_SUPER_FOLLOW);
        }}
        outline
        size={small ? "sm" : "md"}
      >
        {title}
      </Button>
      <Modal
        onClose={() => setShowFollowModal(false)}
        show={showFollowModal}
        title={
          <span>
            Super follow <Slug slug={getAccount(profile).slugWithPrefix} />
          </span>
        }
      >
        <FollowModule
          profile={profile}
          setShowFollowModal={setShowFollowModal}
        />
      </Modal>
    </>
  );
};

export default SuperFollow;
