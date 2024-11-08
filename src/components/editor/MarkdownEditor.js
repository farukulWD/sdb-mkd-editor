import { BoldItalicUnderlineToggles, MDXEditor, UndoRedo, headingsPlugin, toolbarPlugin } from '@mdxeditor/editor'
import React ,{ useEffect, useRef } from 'react';
import '@mdxeditor/editor/style.css'

function MarkdownEditor({
    value='# Hello World',
    onChange,
    toolbarProps,
    placeholder = "Write Here...",
    items = []}) {
        const editorRef = useRef(null);
        useEffect(() => {
            if (editorRef.current) {
              const currentMarkdown = editorRef.current.getMarkdown();
              if (currentMarkdown !== value) {
                editorRef.current.setMarkdown(value);
              }
            }
          }, [value]);


        const handleEditorChange = () => {
            const markdownContent = editorRef?.current?.getMarkdown() || "";
        onChange(markdownContent)}

  return <MDXEditor       onChange={handleEditorChange}   ref={editorRef}  markdown={value} placeholder={placeholder} plugins={[
    headingsPlugin(),
    toolbarPlugin({
      toolbarClassName: 'my-classname',
    
      toolbarContents: () => (
        <>
          {' '}
          <UndoRedo />
          <BoldItalicUnderlineToggles />
        </>
      )
    })
  ]} />
}

export default MarkdownEditor