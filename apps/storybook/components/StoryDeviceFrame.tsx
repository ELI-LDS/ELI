import type { ReactNode } from 'react';
import './StoryDeviceFrame.css';

export type StoryPlacement = 'bottom' | 'bottom-end' | 'center' | 'start' | 'top';

interface StoryDeviceFrameProps {
  children: ReactNode;
  label?: string | undefined;
  placement?: StoryPlacement;
}

interface StoryPreviewLayoutProps extends StoryDeviceFrameProps {
  device?: 'mobile';
  editor?: ReactNode;
}

interface StoryOverviewProps {
  children: ReactNode;
  description?: string;
}

interface StoryCaseProps {
  children: ReactNode;
  description?: string;
  title: string;
}

/** Storybook에서 컴포넌트가 놓일 화면 크기와 위치를 일관되게 보여줘요. */
export function StoryDeviceFrame({
  children,
  label,
  placement = 'center',
}: StoryDeviceFrameProps) {
  return (
    <section
      aria-label={label ?? '모바일 미리보기'}
      className="eli-story-device"
    >
      <div className="eli-story-device__surface" data-placement={placement}>
        {children}
      </div>
    </section>
  );
}

/** 복잡한 Story의 편집 영역과 실제 미리보기를 명확히 분리해요. */
export function StoryPreviewLayout({
  children,
  editor,
  device,
  label,
  placement = 'center',
}: StoryPreviewLayoutProps) {
  return (
    <div className="eli-story-preview-layout" data-device={device ?? 'web'}>
      {editor === undefined ? null : (
        <aside aria-label="미리보기 설정" className="eli-story-preview-layout__editor">
          {editor}
        </aside>
      )}
      <div className="eli-story-preview-layout__preview">
        {device === 'mobile' ? (
          <StoryDeviceFrame label={label} placement={placement}>
            {children}
          </StoryDeviceFrame>
        ) : children}
      </div>
    </div>
  );
}

/** 설명과 검수할 컴포넌트 조합을 분리된 영역으로 정리해요. */
export function StoryOverview({ children, description }: StoryOverviewProps) {
  return (
    <div className="eli-story-overview">
      {description === undefined ? null : (
        <p className="eli-story-overview__description">{description}</p>
      )}
      <div className="eli-story-overview__cases">{children}</div>
    </div>
  );
}

/** 한눈에 보기에서 각 디자인 조합의 이름과 설명을 같은 형식으로 표시해요. */
export function StoryCase({ children, description, title }: StoryCaseProps) {
  return (
    <section className="eli-story-case">
      <header className="eli-story-case__header">
        <strong>{title}</strong>
        {description === undefined ? null : <p>{description}</p>}
      </header>
      <div className="eli-story-case__preview">{children}</div>
    </section>
  );
}
