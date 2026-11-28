import { useId, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { installers } from '../data/installation';
import type { InstallerId } from '../data/installation';

export function useInstallation() {
  const [installer, setInstaller] = useState<InstallerId>('npm');
  const id = useId();
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const index = installers.findIndex(item => item.id === installer);
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? installers.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + installers.length) % installers.length;
    setInstaller(installers[next]!.id);
    event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
  };
  return { installer, setInstaller, id, onKeyDown };
}
