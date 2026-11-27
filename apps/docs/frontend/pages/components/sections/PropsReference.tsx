import type { getProps } from '../../../../content/query';
import { docInline } from './DocInline';
import { groupDocProps } from '../data/orderDocProps';
import { parseObjectListType } from '../data/parseObjectListType';

type PropsResult = Exclude<ReturnType<typeof getProps>, { error: unknown }>;

function PropList({ props }: { props: PropsResult['props'] }) {
  return <dl className="doc-api__list">
      {props.map(prop => {
        const type = String(prop.type ?? '—');
        const objectList = parseObjectListType(type);
        const values = type.split('|').map(value => value.trim());
        const options = values.every(value => /^(['"])[^'"]+\1$/.test(value)) ? values : [];
        return <div className="doc-api__prop" data-prop={prop.name} key={prop.name}>
          <dt className="doc-api__name"><code>{prop.name}</code>{' '}<span className="doc-api__requirement" data-required={Boolean(prop.required)}>{prop.required ? '필수' : '선택'}</span></dt>
          <dd>
            <div className="doc-api__meta">
              <div><span>타입</span>{options.length ? <code className="doc-api__values">{options.map((value, index) => <span className="doc-api__literal" key={value}>{index ? <span className="doc-api__separator">{' | '}</span> : null}{value}</span>)}</code> : <code className="doc-api__type">{objectList?.label ?? type}</code>}</div>
              {prop.default !== null && prop.default !== undefined ? <div><span>기본값</span><code className="doc-api__default">{String(prop.default)}</code></div> : null}
            </div>
            <p className="doc-api__description">{docInline(String(prop.description || '설명이 아직 제공되지 않았어요.'))}</p>
            {objectList ? <details className="doc-api__fields"><summary>항목에 넣을 값</summary><dl>{objectList.fields.map(field => <div key={field.name}><dt><code>{field.name}</code><span>{field.optional ? '선택' : '필수'}</span></dt><dd><code>{field.type}</code></dd></div>)}</dl></details> : null}
          </dd>
        </div>;
      })}
    </dl>;
}

/** 찾는 목적별로 묶고 정확한 타입과 설명은 전체 속성 안에 유지해요. */
export function PropsReference({ api, headingLevel = 3 }: { api: PropsResult; headingLevel?: 3 | 4 }) {
  const Heading = headingLevel === 4 ? 'h4' : 'h3';
  return <div aria-label={`${api.name} 전체 속성`} className="doc-api" role="group">
    {groupDocProps(api.props).map(group => <section aria-label={group.title} className="doc-api__category" key={group.id}>
      <Heading className="eli-typo-label-large">{group.title}</Heading><PropList props={group.props} />
    </section>)}
    {api.extends ? <details className="doc-details"><summary>기본 HTML 속성도 전달할 수 있어요</summary><p>아래 타입에서 허용하는 기본 HTML 속성도 사용할 수 있어요. ELI가 다시 정의하거나 제외한 속성은 이 타입을 기준으로 확인해요.</p><code>{api.extends}</code></details> : null}
  </div>;
}
