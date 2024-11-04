'use client';

import dynamic from 'next/dynamic';
import React, { useState } from 'react';
const MarkDownEditor = dynamic(
    () => import('../components/markdownEditor/MarkDownEditor'),
    {
        ssr: false,
    },
);

export default function Example() {
    const [data, setData] = useState({ description: '#Initila value' });

    return (
        <MarkDownEditor
            value={'# Hello This is farukul islam'}
            onChange={(value) => {
                console.log('Description updated:', value);
                setData((prev) => ({ ...prev, description: value }));
            }}
            placeholder="Write Here..."
        />
    );
}
