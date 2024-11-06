import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import MarkDownEditor from './components/MarkdownEditor/MarkDownEditor'


createRoot(document.getElementById('root')).render(
<div style={{height:"100vh"}}>
<MarkDownEditor />
</div>
 

)
