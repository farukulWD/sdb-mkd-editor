import { BoldItalicUnderlineToggles, MDXEditor, UndoRedo, headingsPlugin, toolbarPlugin } from '@mdxeditor/editor';
import React, { useEffect, useRef } from 'react';
import '@mdxeditor/editor/style.css';
function MarkdownEditor(_ref) {
  var _ref$value = _ref.value,
    value = _ref$value === void 0 ? '# Hello World' : _ref$value,
    onChange = _ref.onChange,
    toolbarProps = _ref.toolbarProps,
    _ref$placeholder = _ref.placeholder,
    placeholder = _ref$placeholder === void 0 ? "Write Here..." : _ref$placeholder,
    _ref$items = _ref.items,
    items = _ref$items === void 0 ? [] : _ref$items;
  var editorRef = useRef(null);
  useEffect(function () {
    if (editorRef.current) {
      var currentMarkdown = editorRef.current.getMarkdown();
      if (currentMarkdown !== value) {
        editorRef.current.setMarkdown(value);
      }
    }
  }, [value]);
  var handleEditorChange = function handleEditorChange() {
    var _editorRef$current;
    var markdownContent = (editorRef === null || editorRef === void 0 || (_editorRef$current = editorRef.current) === null || _editorRef$current === void 0 ? void 0 : _editorRef$current.getMarkdown()) || "";
    onChange(markdownContent);
  };
  return /*#__PURE__*/React.createElement(MDXEditor, {
    onChange: handleEditorChange,
    ref: editorRef,
    markdown: value,
    placeholder: placeholder,
    plugins: [headingsPlugin(), toolbarPlugin({
      toolbarClassName: 'my-classname',
      toolbarContents: function toolbarContents() {
        return /*#__PURE__*/React.createElement(React.Fragment, null, ' ', /*#__PURE__*/React.createElement(UndoRedo, null), /*#__PURE__*/React.createElement(BoldItalicUnderlineToggles, null));
      }
    })]
  });
}
export default MarkdownEditor;