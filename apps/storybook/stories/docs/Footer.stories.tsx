import type { Meta, StoryObj } from '@storybook/react-vite';
import { Footer } from '@/apps/docs/frontend/layouts/Footer/Footer';
import { StoryCase, StoryOverview } from '../../components/StoryDeviceFrame.js';
import './DocsWebsite.stories.css';

interface FooterStoryProps { text: string; previewWidth: number }
function FooterPreview({ text, previewWidth }: FooterStoryProps) {
  return <div className="docs-web-story__surface" style={{ width: previewWidth }}><Footer>{text.split('\n').map((line, i) => <p key={i}>{line}</p>)}</Footer></div>;
}

const meta = {
  title: '문서 웹사이트/Footer', component: FooterPreview,
  args: { text: '푸터 안내 문구 예시예요.\n최종 저작권 문구는 추후 확정해요.', previewWidth: 992 },
  argTypes: {
    text: { name: '푸터 문구', control: 'text', description: '줄바꿈으로 문장을 구분해요. 예시 문구는 컴포넌트의 기본값이 아니에요.' },
    previewWidth: { name: '미리보기 너비', control: { type: 'range', min: 320, max: 1200, step: 1 } },
  },
} satisfies Meta<FooterStoryProps>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {
  name: '한눈에 보기', parameters: { controls: { disable: true } },
  render: () => <StoryOverview description="내용에 따라 높이가 늘어나며, 좁은 영역에서는 문구가 자연스럽게 줄바꿈돼요.">
    <StoryCase title="기본 너비"><FooterPreview text={'푸터 안내 문구 예시예요.\n최종 문구는 추후 확정해요.'} previewWidth={992} /></StoryCase>
    <StoryCase title="좁은 너비"><FooterPreview text="긴 푸터 안내 문구가 들어와도 해당 영역을 벗어나지 않고 모두 읽을 수 있어요." previewWidth={375} /></StoryCase>
  </StoryOverview>,
};
export const Playground: Story = { name: '직접 바꿔보기' };
