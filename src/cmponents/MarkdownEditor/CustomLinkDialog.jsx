// CustomLinkDialog.jsx
"use client"

import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, Tooltip, message, AutoComplete } from 'antd';
import {
    EditOutlined,
    CopyOutlined,
    LinkOutlined,
    CheckOutlined,
} from '@ant-design/icons';
import { useCellValues, usePublisher } from '@mdxeditor/gurx';
import {
    cancelLinkEdit$,
    linkAutocompleteSuggestions$,
    linkDialogState$,
    onWindowChange$,
    removeLink$,
    switchFromPreviewToLinkEdit$,
    updateLink$,
    onClickLinkCallback$,

    
    
} from '@mdxeditor/editor'; // Adjust the import path if necessary

const CustomLinkDialog = () => {

    
    // Extract necessary state values using useCellValues
    const [
        linkDialogState,
        linkAutocompleteSuggestions,
        onClickLinkCallback,
    ] = useCellValues(
        linkDialogState$,
        linkAutocompleteSuggestions$,
        onClickLinkCallback$,
        
    );

    // Publishers for updating state
    const publishWindowChange = usePublisher(onWindowChange$);
    const updateLink = usePublisher(updateLink$);
    const cancelLinkEdit = usePublisher(cancelLinkEdit$);
    const switchFromPreviewToLinkEdit = usePublisher(switchFromPreviewToLinkEdit$);
    const removeLink = usePublisher(removeLink$);

    // Local state for form and UI interactions
    const [form] = Form.useForm();
    const [copyTooltipVisible, setCopyTooltipVisible] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);

    // Handle window resize and scroll events
    useEffect(() => {
        const update = () => {
            publishWindowChange(true);
        };

        window.addEventListener('resize', update);
        window.addEventListener('scroll', update);

        return () => {
            window.removeEventListener('resize', update);
            window.removeEventListener('scroll', update);
        };
    }, [publishWindowChange]);

    // Control modal visibility based on linkDialogState
    useEffect(() => {
      
        
        if (linkDialogState.type !== 'inactive') {
            setIsModalVisible(true);
            if (linkDialogState.type === 'edit') {
                console.log({linkDialogState});
                
                form.setFieldsValue({
                    url: linkDialogState.url,
                    title: linkDialogState.title,
                });
            }
        } else {
            setIsModalVisible(false);
        }
    }, [linkDialogState, form]);

    // Handle form cancellation
    const handleCancel = () => {
        if (linkDialogState$ === 'edit') {

            cancelLinkEdit();
        }

        setIsModalVisible(false);
    };

    // Handle form submission
    const handleFinish = (values) => {
        updateLink(values);
        setIsModalVisible(false);
        message.success('Link updated successfully');
    };

    // Handle URL copy to clipboard
    const handleCopy = () => {
        navigator.clipboard.writeText(linkDialogState.url).then(() => {
            setCopyTooltipVisible(true);
            message.success('URL copied to clipboard');
            setTimeout(() => {
                setCopyTooltipVisible(false);
            }, 1000);
        });
    };

    // Determine if the URL is external
    const urlIsExternal =
        linkDialogState.type === 'preview' && linkDialogState.url.startsWith('http');

    // Handle switching to edit mode
    const handleEdit = () => {
        switchFromPreviewToLinkEdit();
    };

    // Handle link removal
    const handleRemove = () => {
        removeLink();
        message.info('Link removed');
        setIsModalVisible(false);
    };

    // Handle link click callback
    const handleLinkClick = (e) => {
        if (onClickLinkCallback) {
            e.preventDefault();
            onClickLinkCallback(linkDialogState.url);
        }
    };

    return (
        <Modal
            title={
                linkDialogState.type === 'edit'
                    ? 'Edit Link'
                    : 'Link Preview'
            }
            open={isModalVisible}
            onCancel={handleCancel}
            footer={null}
            destroyOnClose
            getContainer={false} // Ensures modal is rendered within the current DOM hierarchy
            mask={false}
            style={{
                position: 'absolute',
                top: linkDialogState.rectangle?.top || 0,
                left: linkDialogState.rectangle?.left || 0,
            }}
            styles={{
                width: linkDialogState.rectangle?.width || 'auto',
                height: linkDialogState.rectangle?.height || 'auto',
                padding: '16px',
            }}
        >
            {linkDialogState.type === 'edit' && (
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleFinish}
                >
                    {/* URL Field */}
                    <Form.Item
                        label="URL"
                        name="url"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter a URL',
                            },
        
                        ]}
                    >
                        <AutoComplete
                            options={linkAutocompleteSuggestions.map((suggestion) => ({
                                value: suggestion,
                            }))}
                            placeholder="Select or paste an URL"
                            filterOption={(inputValue, option) =>
                                option.value
                                    .toLowerCase()
                                    .includes(inputValue.toLowerCase())
                            }
                            autoFocus
                        />
                    </Form.Item>

                    {/* Title Field */}
                    {/* <Form.Item
                        label="Title"
                        name="title"
                    >
                        <Input />
                    </Form.Item> */}

                    {/* Optional Text Field */}
                    {/* {linkDialogState.type === 'edit' && (
                        <Form.Item
                            label="Text"
                            name="text"
                            rules={[
                                {
                                    required: false,
                                },
                            ]}
                        >
                            <Input.TextArea rows={4} placeholder="Enter additional text (optional)" />
                        </Form.Item>
                    )} */}

                    {/* Action Buttons */}
                    <Form.Item>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                gap: '8px',
                            }}
                        >
                            <Button type="primary" htmlType="submit">
                                Save
                            </Button>
                            <Button onClick={handleCancel}>
                                Cancel
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
            )}

            {linkDialogState.type === 'preview' && (
                <div>
                    <a
                        href={linkDialogState.url}
                        target={urlIsExternal ? '_blank' : '_self'}
                        rel={urlIsExternal ? 'noreferrer' : undefined}
                        onClick={handleLinkClick}
                    >
                        {linkDialogState.url}
                        {urlIsExternal && <LinkOutlined style={{ marginLeft: 4 }} />}
                    </a>

                    {linkDialogState.text && (
                        <p style={{ marginTop: '8px' }}>{linkDialogState.text}</p>
                    )}

                    <div
                        style={{
                            marginTop: 16,
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: '8px',
                        }}
                    >
                        {/* Edit Button */}
                        <Tooltip title="Edit link URL">
                            <Button
                                icon={<EditOutlined />}
                                onClick={handleEdit}
                                aria-label="Edit link"
                            />
                        </Tooltip>

                        {/* Copy Button */}
                        <Tooltip title="Copy URL">
                            <Button
                                icon={copyTooltipVisible ? <CheckOutlined /> : <CopyOutlined />}
                                onClick={handleCopy}
                                aria-label="Copy URL"
                            />
                        </Tooltip>

                        {/* Remove Button */}
                        <Tooltip title="Remove link">
                            <Button
                                icon={<LinkOutlined />}
                                onClick={handleRemove}
                                aria-label="Remove link"
                            />
                        </Tooltip>
                    </div>
                </div>
            )}
        </Modal>
    );
};

export default CustomLinkDialog;
