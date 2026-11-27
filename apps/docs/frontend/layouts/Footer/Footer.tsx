import './Footer.css';
import '../../shared/styles/site';
import type { FooterProps } from './Footer.types';

/** 웹사이트 하단 안내를 표시해요. 확정되지 않은 문구는 기본값으로 넣지 않아요. */
export function Footer({ children, className, ...props }: FooterProps) {
  return (
    <footer {...props} className={['docs-footer', 'eli-typo-body-small', className].filter(Boolean).join(' ')}>
      {children}
    </footer>
  );
}
