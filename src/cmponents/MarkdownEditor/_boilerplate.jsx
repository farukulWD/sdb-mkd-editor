"use client"

import React from 'react'
import  "./MarkDownEditor.module.scss"
import {
    diffSourcePlugin,
    markdownShortcutPlugin,
    AdmonitionDirectiveDescriptor,
    DirectiveDescriptor,
    directivesPlugin,
    frontmatterPlugin,
    headingsPlugin,
    imagePlugin,
    linkDialogPlugin,
    linkPlugin,
    listsPlugin,
    quotePlugin,
    tablePlugin,
    thematicBreakPlugin,
    toolbarPlugin,
    SandpackConfig,
    codeBlockPlugin,
    codeMirrorPlugin,
    sandpackPlugin,
    KitchenSinkToolbar,
    
} from '@mdxeditor/editor'
import dataCode from './dataCode'

import CustomLinkDialog from './CustomLinkDialog'
import CustomImageUpload from './CustomImageUpload'

const defaultSnippetContent = `
export default function App() {
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
    </div>
  );
}
`.trim()

export const virtuosoSampleSandpackConfig = {
    defaultPreset: 'react',
    presets: [
        {
            label: 'React',
            name: 'react',
            meta: 'live react',
            sandpackTemplate: 'react',
            sandpackTheme: 'light',
            snippetFileName: '/App.js',
            snippetLanguage: 'jsx',
            initialSnippetContent: defaultSnippetContent
        },
        {
            label: 'React',
            name: 'react',
            meta: 'live',
            sandpackTemplate: 'react',
            sandpackTheme: 'light',
            snippetFileName: '/App.js',
            snippetLanguage: 'jsx',
            initialSnippetContent: defaultSnippetContent
        },
        {
            label: 'Virtuoso',
            name: 'virtuoso',
            meta: 'live virtuoso',
            sandpackTemplate: 'react',
            sandpackTheme: 'light',
            snippetFileName: '/App.js',
            initialSnippetContent: defaultSnippetContent,
            dependencies: {
                'react-virtuoso': 'latest',
                '@ngneat/falso': 'latest'
            },
            files: {
                '/data.js': dataCode
            }
        }
    ]
}



export const YoutubeDirectiveDescriptor = {
    name: 'youtube',
    type: 'leafDirective',
    testNode(node) {
        return node.name === 'youtube'
    },
    attributes: ['id'],
    hasChildren: false,
    Editor: ({ mdastNode, lexicalNode, parentEditor }) => {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <button
                    onClick={() => {
                        parentEditor.update(() => {
                            lexicalNode.selectNext()
                            lexicalNode.remove()
                        })
                    }}
                >
                    delete
                </button>
                <iframe
                    width="560"
                    height="315"
                    src={`https://www.youtube.com/embed/${mdastNode.attributes.id}`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                ></iframe>
            </div>
        )
    }
}


export const ALL_PLUGINS = [
  
    toolbarPlugin({
       toolbarContents: () => <KitchenSinkToolbar  /> ,
        toolbarClassName: "stickyToolbar",
      }),
    listsPlugin(),
    quotePlugin(),
    headingsPlugin({ allowedHeadingLevels: [1, 2, 3] }),
    linkPlugin({}),
    linkDialogPlugin({
        LinkDialog:CustomLinkDialog,
    }),
    imagePlugin({
      // imageUploadHandler,
      ImageDialog:CustomImageUpload
    }),
    tablePlugin(),
    thematicBreakPlugin(),
    frontmatterPlugin(),
    codeBlockPlugin({ defaultCodeBlockLanguage: 'txt' }), // Default to 'plaintext'
    sandpackPlugin({ sandpackConfig: virtuosoSampleSandpackConfig }),
    codeMirrorPlugin({
      codeBlockLanguages: {
        js: "JavaScript",
        css: "CSS",
        txt: "Text",
        tsx: "TypeScript",
        json: "JSON",
        plaintext: "Text", // Handle 'plaintext' as 'Text'
        null: "Text", // Catch any null cases explicitly
        undefined: "Text", // Catch any undefined cases
        default: "Text", // Default to Text
      },
    }),
    directivesPlugin({ directiveDescriptors: [YoutubeDirectiveDescriptor, AdmonitionDirectiveDescriptor] }),
    diffSourcePlugin({ viewMode: 'rich-text', diffMarkdown: '### Diff Content Here' }), // Ensure valid Markdown
    markdownShortcutPlugin()
  ];