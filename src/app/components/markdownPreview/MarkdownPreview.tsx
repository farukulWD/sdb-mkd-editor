'use client';

import dynamic from 'next/dynamic';
import React from 'react';
const Preview = dynamic(() => import('@uiw/react-markdown-preview'), {
    ssr: false,
});
import rehypeSanitize from 'rehype-sanitize';
import './MarkDownPreview.module.scss';

export default function MarkdownPreview({
    source,
    code,
}: {
    source: string;
    code?: any;
}) {
    const rehypePlugins = [rehypeSanitize];
    return (
        <Preview
            source={source}
            rehypePlugins={rehypePlugins}
            style={{ height: '100%', width: '100%' }}
            components={{
                code: code,
            }}
        />
    );
}
