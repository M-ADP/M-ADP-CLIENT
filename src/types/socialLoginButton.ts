export type SocialProvider = 'google' | 'github';

export type SocialLoginButtonProps = {
  provider: SocialProvider;
  onClick?: () => void;
  className?: string;
};
