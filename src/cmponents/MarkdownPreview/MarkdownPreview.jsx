"use client"

import React from 'react'
import Preview from '@uiw/react-markdown-preview';
export default function MarkdownPreview({source,className,...rest}) {
  return (
    <Preview source={source} className='' {...rest}  />
  )
}
