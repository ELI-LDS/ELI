import type { CSSProperties } from 'react';

export interface CodeBlockProps {
  /** 표시할 원본 코드예요. 줄바꿈과 들여쓰기를 유지해요. */
  code: string;
  /** 문법 강조할 언어예요. 기본값 tsx이며 css·json·bash 등을 지원해요. 모르는 언어는 원문으로 표시해요. */
  language?: string;
  /** 처음부터 펼쳐 보여줄지 정해요. 기본값 false이며 이후에는 코드 보기 버튼으로 펼쳐요. */
  defaultExpanded?: boolean;
  /** 스크롤 영역을 설명하는 문구예요. 기본값은 `코드 예시`예요. */
  label?: string;
  /** 바깥 컨테이너에 추가할 클래스예요. */
  className?: string;
  /** 바깥 컨테이너의 너비 등 레이아웃을 바꿔요. */
  style?: CSSProperties;
}
