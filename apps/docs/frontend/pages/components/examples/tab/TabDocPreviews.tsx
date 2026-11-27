import { Tab } from '../../../../shared/ui/tab';
import { TabExample } from './TabExample';

export function TabBasicPreview() {
  return (
    <div aria-label="강의 보기" role="tablist"><Tab label="내 강의" /></div>
  );
}

export function TabPanelsPreview() {
  return (
    <TabExample />
  );
}

