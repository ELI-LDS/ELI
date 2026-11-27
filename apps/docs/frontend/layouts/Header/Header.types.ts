import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';

export interface HeaderLink {
  label: string;
  href: string;
  /** 아직 페이지가 없으면 링크 대신 같은 위치의 문구로 표시해요. */
  pending?: boolean;
}

export interface HeaderProps extends Omit<HTMLAttributes<HTMLElement>, 'children' | 'dangerouslySetInnerHTML'> {
  /** PC 헤더의 탐색 링크예요. 실제 페이지 경로를 전달해요. */
  links?: readonly HeaderLink[];
  /** 로고를 눌렀을 때 이동할 경로예요. 기본값은 `/`예요. */
  homeHref?: string;
  /** 새 탭으로 열 GitHub 저장소 주소예요. 기본값은 ELI 공개 저장소예요. */
  githubHref?: string;
  /** 검색 기능의 Client Component를 전달해요. 생략하면 연결 전 버튼만 보여줘요. */
  searchAction?: ReactNode;
  /** 모바일 메뉴 기능의 Client Component를 전달해요. 생략하면 연결 전 버튼만 보여줘요. */
  menuAction?: ReactNode;
}

export interface HeaderActionProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'dangerouslySetInnerHTML'> {
  /** 사용할 아이콘이에요. `search`는 검색, `menu`는 모바일 메뉴예요. */
  action: 'search' | 'menu';
}
