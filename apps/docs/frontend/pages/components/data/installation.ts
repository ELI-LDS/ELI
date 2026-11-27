export const installers = [
  { id: 'npm', label: 'npm', prefix: 'npx' },
  { id: 'pnpm', label: 'pnpm', prefix: 'pnpm dlx' },
  { id: 'yarn', label: 'yarn', prefix: 'yarn dlx' },
  { id: 'bun', label: 'Bun', prefix: 'bunx' },
] as const;
export type InstallerId = typeof installers[number]['id'];

export function installationCommand(installer: InstallerId, action: 'init' | 'add', componentId: string) {
  const prefix = installers.find(item => item.id === installer)!.prefix;
  return `${prefix} eli-design@latest ${action}${action === 'add' ? ` ${componentId}` : ''}`;
}
