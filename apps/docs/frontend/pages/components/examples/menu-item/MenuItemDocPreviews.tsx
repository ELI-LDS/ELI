import { MenuItem } from '../../../../shared/ui/menu-item';

export function MenuItemBasicPreview() {
  return (
    <div className="docs-demo__narrow"><MenuItem>이름 변경</MenuItem></div>
  );
}

export function MenuItemShortcutPreview() {
  return (
    <div className="docs-demo__narrow"><MenuItem shortcut="⌘K">검색</MenuItem></div>
  );
}

export function MenuItemDisabledPreview() {
  return (
    <div className="docs-demo__narrow"><MenuItem disabled>이름 변경</MenuItem></div>
  );
}

