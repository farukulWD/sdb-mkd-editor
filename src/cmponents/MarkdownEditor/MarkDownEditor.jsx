// MarkDownEditor.jsx
"use client"
import React, { useCallback, useEffect, useRef, useState } from "react";
import "./style.css";
import { MDXEditor } from "@mdxeditor/editor";
import { ALL_PLUGINS } from "./_boilerplate";
import { Modal, Input, List } from "antd";
import  "./MarkDownEditor.module.scss";

function MarkDownEditor({
  value = "# Write Here",
  onChange,
  toolbarProps,
  placeholder = "Write Here...",
  items = [],
  imageConfige,
  style,
}) {
  const [isModalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
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

  // Debounced onChange handler
  const debounceRef = useRef(null);

  const handleDebouncedChange = useCallback((content) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onChange(content);
    }, 300);
  }, [onChange]);

  // Handle typing in the editor
  const handleEditorChange = () => {
    const markdownContent = editorRef?.current?.getMarkdown() || "";
    handleDebouncedChange(markdownContent); // Update parent state with debounce

    // Detect "@" to show autocomplete modal
    const selection = window.getSelection();
    if (selection && selection.anchorNode) {
      const textBeforeCursor = selection.anchorNode.textContent.slice(
        0,
        selection.anchorOffset
      );
      if (textBeforeCursor.endsWith("@")) {
        const fullText = editorRef?.current?.getMarkdown() || "";
        const cursorIndex =
          fullText.indexOf(textBeforeCursor) + textBeforeCursor.length - 1;
        setLinkToInsertIndex(cursorIndex);
        setFilteredItems(items); // Initialize with all items
        setSearchQuery(""); // Reset search query
        setModalVisible(true);
      }
    }
  };

  // Insert selected item as a link by replacing the last "@" in the markdown
  const insertItemAsLink = (item) => {
    const markdownContent = editorRef?.current?.getMarkdown() || "";
    const link = `[${item.title}](@${item.id})`;
    const updatedMarkdown = `${markdownContent.slice(
      0,
      linkToInsertIndex
    )}${link}${markdownContent.slice(linkToInsertIndex + 1)}`;

    editorRef.current.setMarkdown(updatedMarkdown);
    onChange(updatedMarkdown);
    setModalVisible(false);
  };

  // Handle search input change
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setFilteredItems(
      query.trim() === "" ? items : items.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase())
      )
    );
  };

  return (
    <div style={style} className={"contentsEditable"}>
      <MDXEditor
        markdown={value}
        placeholder={placeholder}
        ref={editorRef}
        onChange={handleEditorChange}
        plugins={ALL_PLUGINS(toolbarProps)}
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
          style={{ marginTop: 16, maxHeight: "400px", overflowY: "auto" }}
          dataSource={filteredItems}
          locale={{ emptyText: "No items found" }}
          renderItem={(item) => (
            <List.Item
              style={{ cursor: "pointer" }}
              onClick={() => insertItemAsLink(item)}
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
