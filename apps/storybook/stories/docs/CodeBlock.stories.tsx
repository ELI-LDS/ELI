import { useArgs } from 'storybook/preview-api';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { CodeBlock } from '@/apps/docs/frontend/features/code-block/CodeBlock';
import type { CodeBlockProps } from '@/apps/docs/frontend/features/code-block/CodeBlock.types.ts';
import { StoryCase, StoryOverview, StoryPreviewLayout } from '../../components/StoryDeviceFrame.js';
import './DocsWebsite.stories.css';

const exampleCode = `import { Button } from './components/ui/button';

export function SaveButton() {
  const handleSave = () => {
    console.log('저장했어요.');
  };

  return (
    <Button icon={null} onClick={handleSave}>
      저장하기
    </Button>
  );
}`;
type CodeStoryProps = CodeBlockProps & { previewWidth: number };

function CodePreview({ previewWidth, ...props }: CodeStoryProps) {
  return <div className="docs-web-story__surface" style={{ width: previewWidth }}><CodeBlock key={String(props.defaultExpanded)} {...props} /></div>;
}

const meta = {
  title: '문서 웹사이트/CodeBlock', component: CodeBlock,
  args: { code: exampleCode, language: 'tsx', defaultExpanded: false, label: 'Button 사용 예시', previewWidth: 720 },
  argTypes: {
    code: { name: '코드', control: 'text', description: '왼쪽 편집 영역에서 여러 줄의 코드를 입력할 수도 있어요.' },
    language: { name: '코드 언어', options: ['tsx', 'typescript', 'jsx', 'javascript', 'css', 'json', 'bash', 'markup', 'text'], control: 'select' },
    defaultExpanded: { name: '처음부터 펼치기', control: 'boolean', description: '변경하면 미리보기를 초기 상태로 다시 보여줘요.' },
    label: { name: '코드 영역 설명', control: 'text' },
    previewWidth: { name: '미리보기 너비', control: { type: 'range', min: 320, max: 1024, step: 1 } },
  },
  render: args => <CodePreview {...args} />,
} satisfies Meta<CodeStoryProps>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  name: '한눈에 보기', parameters: { controls: { disable: true } },
  render: () => <StoryOverview description="코드 보기를 누르면 펼쳐져요. 펼친 뒤에는 최대 10줄까지 보이고 나머지는 코드 영역 안에서 스크롤해요.">
    <StoryCase title="접힘"><CodePreview code={exampleCode} previewWidth={720} /></StoryCase>
    <StoryCase title="펼침 · 10줄 이후 스크롤"><CodePreview code={exampleCode} defaultExpanded previewWidth={720} /></StoryCase>
    <StoryCase title="짧은 코드"><CodePreview code={'const message = "안녕하세요";'} defaultExpanded previewWidth={720} /></StoryCase>
  </StoryOverview>,
};
export const Playground: Story = {
  name: '직접 바꿔보기',
  render: function Playground(args) {
    const [, updateArgs] = useArgs<CodeStoryProps>();
    return <StoryPreviewLayout editor={(
      <div className="docs-web-story__editor">
        <label>코드 편집<textarea rows={18} value={args.code} onChange={event => updateArgs({ code: event.currentTarget.value })} spellCheck={false} /></label>
      </div>
    )}><CodePreview {...args} /></StoryPreviewLayout>;
  },
};
