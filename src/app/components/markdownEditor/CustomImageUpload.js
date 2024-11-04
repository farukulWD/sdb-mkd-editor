'use client';

import React, { useState } from 'react';
import { Modal, Input, Button, Upload, Spin } from 'antd';
import { useCellValues, usePublisher } from '@mdxeditor/gurx';
import { UploadOutlined } from '@ant-design/icons';
import {
    closeImageDialog$,
    imageDialogState$,
    saveImage$,
} from '@mdxeditor/editor';
import axios from 'axios';

const { Dragger } = Upload;

const ImageDialog = () => {
    const [state] = useCellValues(imageDialogState$);
    const saveImage = usePublisher(saveImage$);
    const closeImageDialog = usePublisher(closeImageDialog$);

    // State for input values
    const [src, setSrc] = useState(
        state.type === 'editing' ? state.initialValues.src : '',
    );
    const [altText, setAltText] = useState(
        state.type === 'editing' ? state.initialValues.altText : '',
    );
    const [title, setTitle] = useState(
        state.type === 'editing' ? state.initialValues.title : '',
    );
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    // Function to handle image upload
    async function imageUploadHandler(image) {
        const formData = new FormData();
        formData.append('image', image);
        formData.append('path', 'blog-image');

        try {
            const response = await axios.post(
                '/settings/watermark-image',
                formData,
            );
            return response.data.url;
        } catch (error) {
            console.error('Image upload failed:', error);
            throw error;
        }
    }

    // Handle form submission
    const handleSave = () => {
        if (file) {
            setLoading(true);
            imageUploadHandler(file)
                .then((url) => {
                    saveImage({ src: url, altText, title, file: [] });
                    setLoading(false);
                    resetForm();
                })
                .catch(() => {
                    setLoading(false);
                });
        } else {
            saveImage({ src, altText, title, file: [] });
            resetForm();
        }
    };

    // Reset and close the modal
    const handleCancel = () => {
        closeImageDialog();
        resetForm();
    };

    // Clear the form and reset file input
    const resetForm = () => {
        setSrc('');
        setAltText('');
        setTitle('');
        setFile(null);
    };

    // Handle file selection in drag-and-drop area
    const handleFileChange = (info) => {
        console.log(info);

        const selectedFile = info.file;
        setFile(selectedFile);
        setSrc(''); // Clear the URL field if a file is selected
    };

    return (
        <Modal
            title="Upload an Image"
            visible={state.type !== 'inactive'}
            onCancel={handleCancel}
            footer={[
                <Button key="cancel" onClick={handleCancel} disabled={loading}>
                    Cancel
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    onClick={handleSave}
                    loading={loading}
                >
                    Save
                </Button>,
            ]}
            centered
        >
            <Spin spinning={loading}>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px',
                    }}
                >
                    <div style={fieldStyle}>
                        <label>Upload an image from your device:</label>
                        <Dragger
                            beforeUpload={() => false} // Prevent automatic upload
                            onChange={handleFileChange}
                            maxCount={1}
                            accept="image/*"
                            fileList={file ? [file] : []} // Reset file list after upload
                        >
                            <p className="ant-upload-drag-icon">
                                <UploadOutlined />
                            </p>
                            <p className="ant-upload-text">
                                Click or drag file to this area to upload
                            </p>
                        </Dragger>
                    </div>

                    <div style={fieldStyle}>
                        <label>Or add an image from a URL:</label>
                        <Input
                            type="text"
                            value={src}
                            onChange={(e) => setSrc(e.target.value)}
                            placeholder="Select or paste an image URL"
                            disabled={file !== null} // Disable if a file is selected
                        />
                    </div>

                    <div style={fieldStyle}>
                        <label>Alt Text:</label>
                        <Input
                            type="text"
                            value={altText}
                            onChange={(e) => setAltText(e.target.value)}
                        />
                    </div>

                    <div style={fieldStyle}>
                        <label>Title:</label>
                        <Input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                </div>
            </Spin>
        </Modal>
    );
};

// Inline styles
const fieldStyle = {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '8px',
};

export default ImageDialog;
