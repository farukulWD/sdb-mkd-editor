// MarkDownEditor.jsx
'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import '@mdxeditor/editor/style.css';
import { MDXEditor } from '@mdxeditor/editor';
import { ALL_PLUGINS } from './_boilerplate';
import { Modal, Input, List, Spin } from 'antd';
import styles from './MarkDownEditor.module.scss';

function MarkDownEditor({
    value,
    onChange,
    toolbarProps,
    placeholder = 'Write Here...',
    items = [],
}) {
    const [isModalVisible, setModalVisible] = useState(false); // Show/hide modal
    const [searchQuery, setSearchQuery] = useState(''); // Search input
    const [filteredItems, setFilteredItems] = useState([]); // Filtered list based on search
    const editorRef = useRef(null);
    const [linkToInsertIndex, setLinkToInsertIndex] = useState(null);

    // Sync external `value` prop with internal editor state
    useEffect(() => {
        if (editorRef.current) {
            const currentMarkdown = editorRef.current.getMarkdown();
            if (currentMarkdown !== value) {
                editorRef.current.setMarkdown(value);
            }
        }
    }, [value]);

    // Debounce function to limit the rate of onChange calls
    const Debounce = (func, delay) => {
        const timeoutRef = useRef(null);
        return (...args) => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => {
                func(...args);
            }, delay);
        };
    };

    // Debounced onChange handler to prevent excessive state updates
    const debouncedOnChange = useCallback(Debounce(onChange, 300), [onChange]);

    // Handle typing in the editor
    const handleEditorChange = () => {
        const markdownContent = editorRef?.current?.getMarkdown() || '';

        debouncedOnChange(markdownContent); // Update parent state with debounce

        // Detect "@" to show autocomplete modal
        const selection = window.getSelection();

        if (selection && selection.anchorNode) {
            const textBeforeCursor = selection.anchorNode.textContent.slice(
                0,
                selection.anchorOffset,
            );
            if (textBeforeCursor.endsWith('@')) {
                // Get current index of cursor for full text
                const fullText = editorRef?.current?.getMarkdown() || '';
                const cursorIndex =
                    fullText.indexOf(textBeforeCursor) +
                    textBeforeCursor.length -
                    1;
                setLinkToInsertIndex(cursorIndex);
                setFilteredItems(items); // Initialize with all items
                setSearchQuery(''); // Reset search query
                setModalVisible(true);
            }
        }
    };

    // Insert selected item as a link by replacing the last "@" in the markdown
    const insertItemAsLink = ({ item, linkToInsertIndex }) => {
        const markdownContent = editorRef?.current?.getMarkdown() || '';
        const link = `[${item.title}](@${item.id})`;
        const updatedMarkdown = `${markdownContent.slice(0, linkToInsertIndex)}${link}${markdownContent.slice(linkToInsertIndex + 1)}`;

        editorRef.current.setMarkdown(updatedMarkdown);

        onChange(updatedMarkdown);
        setModalVisible(false);
    };

    // Handle search input change
    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (query.trim() === '') {
            setFilteredItems(items);
        } else {
            const filtered = items.filter((item) =>
                item.title.toLowerCase().includes(query.toLowerCase()),
            );
            setFilteredItems(filtered);
        }
    };

    return (
        <div className={styles.contentsEditable}>
            <MDXEditor
                markdown={value} // Handle multiple newlines using zero-width space
                placeholder={placeholder}
                ref={editorRef}
                onChange={handleEditorChange} // Handle editor changes
                plugins={ALL_PLUGINS}
            />

            {/* Autocomplete Modal */}
            <Modal
                title="Select an Item"
                visible={isModalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}
            >
                <Input
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={handleSearch}
                    allowClear
                />
                <List
                    style={{
                        marginTop: 16,
                        maxHeight: '400px',
                        overflowY: 'auto',
                    }}
                    dataSource={filteredItems}
                    locale={{ emptyText: 'No items found' }}
                    renderItem={(item) => (
                        <List.Item
                            style={{ cursor: 'pointer' }}
                            onClick={() =>
                                insertItemAsLink({ item, linkToInsertIndex })
                            }
                        >
                            {item.title} (ID:{item.id})
                        </List.Item>
                    )}
                />
            </Modal>
        </div>
    );
}

export default MarkDownEditor;
