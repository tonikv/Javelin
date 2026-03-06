import { memo, type ReactElement } from 'react';
import { LanguageSwitch } from './LanguageSwitch';
import { ThemeToggle } from './ThemeToggle';

type TopBarProps = {
  appTitle: string;
  gameTitle: string;
};

const TopBarComponent = ({ appTitle, gameTitle }: TopBarProps): ReactElement => (
  <header className="topbar">
    <div className="topbar-title">
      <p className="eyebrow">{appTitle}</p>
      <h1>{gameTitle}</h1>
    </div>
    <div className="topbar-controls">
      <LanguageSwitch />
      <ThemeToggle />
    </div>
  </header>
);

export const TopBar = memo(TopBarComponent);
