'use client';

import { InstallationCommand } from './InstallationCommand';
import { Tab } from '../../../shared/ui/tab';
import { installers, installationCommand } from '../data/installation';
import { useInstallation } from './useInstallation';

export function InstallationSection({ componentId }: { componentId: string }) {
  const { installer, setInstaller, id, onKeyDown } = useInstallation();
  return <div className="doc-installation">
    <div aria-label="설치 도구" className="doc-installation__tabs" onKeyDown={onKeyDown} role="tablist">
      {installers.map(item => <Tab active={installer === item.id} aria-controls={`${id}-commands`} id={`${id}-${item.id}`} key={item.id} label={item.label} onActiveChange={active => { if (active) setInstaller(item.id); }} tabIndex={installer === item.id ? 0 : -1} />)}
    </div>
    <div aria-labelledby={`${id}-${installer}`} className="doc-installation__commands" id={`${id}-commands`} role="tabpanel">
      <InstallationCommand command={installationCommand(installer, 'add', componentId)} key={`${installer}-${componentId}`} />
    </div>
  </div>;
}
