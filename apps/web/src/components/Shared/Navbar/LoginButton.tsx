import type { FC } from 'react';

import { AUTH } from '@hey/data/tracking';
import { Button } from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import useLogin from 'src/hooks/useLogin';

interface LoginButtonProps {
  className?: string;
  isBig?: boolean;
  title?: string;
}

const LoginButton: FC<LoginButtonProps> = ({
  className = '',
  isBig = false,
  title = 'Login'
}) => {
  const { setOpenLoginModal } = useLogin();

  return (
    <Button
      className={className}
      icon={
        <img
          alt="Lens Logo"
          className="mr-0.5 h-3"
          height={12}
          src="/lens.svg"
          width={19}
        />
      }
      onClick={() => {
        setOpenLoginModal(true);
        Leafwatch.track(AUTH.LOGIN);
      }}
      size={isBig ? 'lg' : 'md'}
    >
      {title}
    </Button>
  );
};

export default LoginButton;
