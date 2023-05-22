import { IconMoon, IconSun } from '@tabler/icons-react';
import { useTranslation } from 'next-i18next';
import { FC } from 'react';
import { SidebarButton } from '../Sidebar/SidebarButton';
import { ClearConversations } from './ClearConversations';
import { useAppSelector } from 'context/redux/store';

interface Props {
  conversationsCount: number;
  onToggleLightMode: (mode: 'light' | 'dark') => void;
}

export const ChatbarSettings: FC<Props> = ({
  conversationsCount,
  onToggleLightMode,
}) => {
  const { t } = useTranslation('sidebar');
  const lightMode = useAppSelector(state => state.lightmode).mode
  return (
    <div className="flex flex-col items-center space-y-1 border-t border-white/20 pt-1 text-sm">
      {conversationsCount > 0 ? (
        <ClearConversations />
      ) : null}

      <SidebarButton
        text={lightMode === 'light' ? t('Dark mode') : t('Light mode')}
        icon={
          lightMode === 'light' ? <IconMoon size={18} /> : <IconSun size={18} />
        }
        onClick={() =>
          onToggleLightMode(lightMode === 'light' ? 'dark' : 'light')
        }
      />
    </div>
  );
};
