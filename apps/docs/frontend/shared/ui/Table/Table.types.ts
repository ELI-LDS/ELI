import type { CSSProperties, ReactNode } from 'react';

export interface TableColumn {
  /** 행의 cells에서 대응하는 값을 찾을 키예요. */
  key: string;
  /** 열 제목이에요. */
  label: ReactNode;
  /** 별도 열 너비가 필요한 경우 지정해요. 생략하면 Figma의 열별 비율을 사용해요. */
  width?: CSSProperties['width'];
}

export interface TableRow {
  /** 행을 추가·삭제해도 유지되는 고유 값이에요. */
  id: string;
  /** 열 key별 셀 내용이에요. 텍스트와 ReactNode를 사용할 수 있어요. */
  cells: Readonly<Record<string, ReactNode>>;
}

export interface TableProps {
  /** 표를 설명하는 제목이에요. 화면에서는 숨기고 화면 낭독기에 제공해요. */
  caption: string;
  /** 표시할 순서의 열 목록이에요. Figma는 2~6열 구성을 제공해요. */
  columns: readonly TableColumn[];
  /** 표시할 행 목록이에요. 빈 배열이면 제목 행만 표시해요. */
  rows: readonly TableRow[];
  /** 표 전체를 감싸는 스크롤 영역의 클래스예요. */
  className?: string;
  /** 표 전체를 감싸는 스크롤 영역의 스타일이에요. */
  style?: CSSProperties;
}
