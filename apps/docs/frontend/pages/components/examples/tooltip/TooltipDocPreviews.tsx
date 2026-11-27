import { Tooltip } from '../../../../shared/ui/tooltip';
import { TooltipExample } from './TooltipExample';

export function TooltipBasicPreview() {
  return (
    <Tooltip>작성 중인 내용은 자동으로 저장돼요.</Tooltip>
  );
}

export function TooltipTriggerPreview() {
  return (
    <TooltipExample />
  );
}

