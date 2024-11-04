export default function stripUseClientDirective() {
    return {
        name: 'strip-use-client',
        transform(code, id) {
            if (id.endsWith('.tsx') || id.endsWith('.jsx')) {
                return {
                    code: code.replace(/"use client";/g, ''),
                    map: null,
                };
            }
            return null;
        },
    };
}
