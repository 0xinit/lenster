import { Button } from '@components/UI/Button';
import { SwitchHorizontalIcon } from '@heroicons/react/outline';
import { Leafwatch } from '@lib/leafwatch';
import { t, Trans } from '@lingui/macro';
import type { FC } from 'react';
import toast from 'react-hot-toast';
import { CHAIN_ID } from 'src/constants';
import { SYSTEM } from 'src/tracking';
import { useSwitchNetwork } from 'wagmi';

interface Props {
  className?: string;
}

const SwitchNetwork: FC<Props> = ({ className = '' }) => {
  const { switchNetwork } = useSwitchNetwork();

  return (
    <Button
      className={className}
      type="button"
      variant="danger"
      icon={<SwitchHorizontalIcon className="h-4 w-4" />}
      onClick={() => {
        if (switchNetwork) {
          switchNetwork(CHAIN_ID);
        } else {
          toast.error(t`Please change your network wallet!`);
        }
        Leafwatch.track(SYSTEM.SWITCH_NETWORK);
      }}
    >
      <Trans>Switch Network</Trans>
    </Button>
  );
};

export default SwitchNetwork;
