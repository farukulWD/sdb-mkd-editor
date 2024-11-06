import React from 'react';
import Preview from '@uiw/react-markdown-preview';
var source = "\n## MarkdownPreview\n";
export default function MarkdownPreview(_ref) {
  var _ref$text = _ref.text,
    text = _ref$text === void 0 ? source : _ref$text;
  return /*#__PURE__*/React.createElement(Preview, {
    source: text,
    style: {
      padding: 16
    }
  });
}