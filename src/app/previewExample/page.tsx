import MarkdownPreview from '../components/markdownPreview/MarkdownPreview';

export default function PreviewEx() {
    const source = `# Hello `;
    return (
        <div data-color-mode="light">
            <MarkdownPreview source={source} />
        </div>
    );
}
