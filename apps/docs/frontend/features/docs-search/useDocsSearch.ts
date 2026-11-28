import { useState } from 'react';
import { searchDocuments } from '../docs-catalog/searchDocuments';

/** 검색은 이미 준비한 문서 목록만 대상으로 하고 없는 목적지로 이동하지 않아요. */
export function useDocsSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const results = searchDocuments(query);
  return { open, setOpen, query, setQuery, results };
}
