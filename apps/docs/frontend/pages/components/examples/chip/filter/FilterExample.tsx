'use client';

import { FilterChip } from '../../../../../shared/ui/filter-chip';
import { Radio } from '../../../../../shared/ui/radio';
import { Checkbox } from '../../../../../shared/ui/checkbox';
import { Tab } from '../../../../../shared/ui/tab';
import { Overlay } from '../../../../../shared/ui/Overlay/Overlay';
import { filterGroups, useFilterExample } from './useFilterExample';
import './FilterExample.css';
import './FilterExample.motion.css';

/** 필터는 문서 앱의 조합 예시이며 공개 BottomSheet API를 추가하지 않아요. */
export function FilterExample() {
  const { open, setOpen, tab, setTab, values, select, id, show } = useFilterExample();
  const group = filterGroups[tab] ?? filterGroups[0];
  return <>
    <div className="docs-filter-example">
      {filterGroups.map((item, index) => {
        const selected = values[item.id];
        return <FilterChip aria-controls={`${id}-dialog`} aria-expanded={open && tab === index} key={item.id} label={item.label} onClick={event => { event.currentTarget.focus({ preventScroll: true }); show(index); }} options={item.options} selectedValues={selected.filter(value => value !== 'all')} />;
      })}
    </div>
    <Overlay id={`${id}-dialog`} label="필터" onClose={() => setOpen(false)} open={open} className="docs-filter-overlay">
      {close => <>
        <div className="docs-filter-example__header">
          <h2 className="eli-typo-heading-h3">필터</h2>
          <button aria-label="필터 닫기" className="docs-overlay__close" data-autofocus onClick={close} type="button"><img alt="" height={24} src="/assets/close.svg" width={24} /></button>
        </div>
        <div aria-label="필터 종류" className="docs-filter-example__tabs" onKeyDown={event => {
          if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
          event.preventDefault(); const next = event.key === 'Home' ? 0 : event.key === 'End' ? 1 : 1 - tab;
          setTab(next); event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
        }} role="tablist">
          {filterGroups.map((item, index) => <Tab active={tab === index} aria-controls={`${id}-panel`} id={`${id}-${item.id}`} key={item.id} label={item.label} onActiveChange={active => { if (active) setTab(index); }} tabIndex={tab === index ? 0 : -1} />)}
          <span aria-hidden="true" />
        </div>
        <div aria-labelledby={`${id}-${group.id}`} id={`${id}-panel`} role="tabpanel">
          <fieldset className="docs-filter-example__options" data-selection={group.selection}>
            <legend className="docs-sr-only">{group.label}</legend>
            {group.options.map(option => <label className="eli-typo-label-large" key={option.value}>
              {group.selection === 'single'
                ? <Radio checked={values[group.id].includes(option.value)} name={`${id}-${group.id}`} onChange={event => select(group.id, option.value, event.currentTarget.checked)} value={option.value} />
                : <Checkbox checked={values[group.id].includes(option.value)} name={`${id}-${group.id}`} onChange={event => select(group.id, option.value, event.currentTarget.checked)} value={option.value} />}
              {option.label}
            </label>)}
          </fieldset>
        </div>
      </>}
    </Overlay>
  </>;
}
