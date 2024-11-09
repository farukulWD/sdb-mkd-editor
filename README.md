

# Getting Started


To begin using the Markdown editor, install it with:
```
npm install @sdbit/mkd-editor
```


Usage Example
Here?s a sample setup for integrating the Markdown editor with dynamic import and state management:

```
"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
const MarkDownEditor = dynamic(() => import("@/components/MarkdownEditor/MarkDownEditor"), { ssr:false})
 fexport default function Home() {
 const [markdownValue, setMarkdownValue] = useState("");
 return (
 <div style={{ height: "100vh", backgroundColor: "white" }} data-color-mod="light">
 <MarkDownEditor
 value={markdownValue}
 onChange={(newContent) => setMarkdownValue(newContent)}
 />
 </div>
 );
}
```


Important Configuration

In your `next.config.js`, include the following configuration to transpile the package:
```
transpilePackages: [
 "@sdbit/mkd-editor"
]
```