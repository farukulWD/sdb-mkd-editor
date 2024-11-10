"use client"

import dynamic from "next/dynamic";
import { useState } from "react";

const  MarkDownEditor = dynamic(()=>import("@/cmponents/MarkdownEditor/MarkDownEditor"),{ssr:false}) ;


export default function Home() {
  const [markdownValue,setMarkdownValue]=useState("")
  const toolbarProps = {
    insertImage: true, // Override to hide InsertImage
  };
  return (
 <div style={{height:"100vh",backgroundColor:"white"}} data-color-mod="light" >
<MarkDownEditor
  value={markdownValue}
  onChange={(newContent) => setMarkdownValue(newContent)}
    toolbarProps={toolbarProps} 
/>
 </div>
  );
}
