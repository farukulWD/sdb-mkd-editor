import React from 'react';
import Preview from '@uiw/react-markdown-preview';

const source = `
## MarkdownPreview
`;

export default function MarkdownPreview ({text=source}) {
  return (
    <Preview source={text} style={{ padding: 16 }} />
  )
}