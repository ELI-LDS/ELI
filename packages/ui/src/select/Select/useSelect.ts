import { useId, useRef, useState } from 'react';
import type { FocusEventHandler, KeyboardEventHandler, MouseEventHandler } from 'react';
import type { SelectProps } from './Select.types.js';

/* Select 동작에 필요한 공개 속성만 받아요. */
interface UseSelectOptions {
  defaultValue: SelectProps['defaultValue'];
  onBlur: SelectProps['onBlur'];
  onKeyDown: SelectProps['onKeyDown'];
  onValueChange: SelectProps['onValueChange'];
  options: SelectProps['options'];
  value: SelectProps['value'];
}

/* 선택 상태와 키보드·포커스 상호작용을 관리해요. */
export function useSelect({
  defaultValue,
  onBlur,
  onKeyDown,
  onValueChange,
  options,
  value,
}: UseSelectOptions) {
  /* 선택 상태 */
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [isOpen, setIsOpen] = useState(false);
  const selectedValue = value ?? internalValue;
  const selectedOption = options.find(option => option.value === selectedValue);

  /* 접근성 연결에 사용하는 ID */
  const generatedId = useId();
  const labelId = `${generatedId}-label`;
  const listboxId = `${generatedId}-listbox`;
  const valueId = `${generatedId}-value`;

  /* 옵션 목록과 선택 버튼의 포커스를 관리하는 참조 */
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  /* 선택 버튼으로 목록을 열고 닫아요. */
  const handleTriggerClick: MouseEventHandler<HTMLButtonElement> = () => {
    setIsOpen(current => !current);
  };

  /* 값을 반영한 뒤 목록을 닫고 선택 버튼으로 포커스를 돌려요. */
  const handleOptionClick = (nextValue: string) => {
    if (value === undefined) setInternalValue(nextValue);
    onValueChange?.(nextValue);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  /* 현재 Select 안에서 이동할 옵션을 찾아 포커스해요. */
  const focusOption = (position: 'first' | 'last' | 'next' | 'previous') => {
    const optionElements = Array.from(
      menuRef.current?.querySelectorAll<HTMLButtonElement>('[role="option"]') ?? [],
    );
    if (optionElements.length === 0) return;

    const focusedIndex = optionElements.indexOf(document.activeElement as HTMLButtonElement);
    const nextIndex =
      position === 'first'
        ? 0
        : position === 'last'
          ? optionElements.length - 1
          : position === 'next'
            ? Math.min(focusedIndex + 1, optionElements.length - 1)
            : Math.max(focusedIndex - 1, 0);

    optionElements[nextIndex]?.focus();
  };

  /* 목록을 연 다음 렌더링된 첫 번째 또는 마지막 옵션으로 이동해요. */
  const openAndFocus = (position: 'first' | 'last') => {
    if (isOpen) {
      focusOption(position);
      return;
    }

    setIsOpen(true);
    requestAnimationFrame(() => focusOption(position));
  };

  /* Select의 방향키 이동과 닫기 동작을 처리해요. */
  const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = event => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;

    if (event.key === 'Escape' && isOpen) {
      event.preventDefault();
      setIsOpen(false);
      triggerRef.current?.focus();
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (isOpen) focusOption('next');
      else openAndFocus('first');
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (isOpen) focusOption('previous');
      else openAndFocus('last');
    }

    if (event.key === 'Home' && isOpen) {
      event.preventDefault();
      focusOption('first');
    }

    if (event.key === 'End' && isOpen) {
      event.preventDefault();
      focusOption('last');
    }
  };

  /* Select 바깥으로 포커스가 이동하면 목록을 닫아요. */
  const handleBlur: FocusEventHandler<HTMLDivElement> = event => {
    onBlur?.(event);
    if (!event.currentTarget.contains(event.relatedTarget)) setIsOpen(false);
  };

  return {
    handleBlur,
    handleKeyDown,
    handleOptionClick,
    handleTriggerClick,
    isOpen,
    labelId,
    listboxId,
    menuRef,
    selectedOption,
    selectedValue,
    triggerRef,
    valueId,
  };
}
