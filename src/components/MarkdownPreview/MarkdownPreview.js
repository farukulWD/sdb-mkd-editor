import React from 'react';
import PropTypes from 'prop-types';
import Preview from '@uiw/react-markdown-preview';

const source = `
## MarkdownPreview
`;

export default function MarkdownPreview({ text = source }) {
  return (
    <Preview source={text} style={{ padding: 16 }} />
  );
}

// Define prop types
MarkdownPreview.propTypes = {
  text: PropTypes.string 
};

// Define default props
MarkdownPreview.defaultProps = {
  text: source
};
