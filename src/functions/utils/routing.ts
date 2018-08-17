export function encodePath(path) {
    function encodeAndAsssemble(str, splitter) {
        return str
            .split(splitter)
            .map((sub) => {
                return Buffer.from(sub).toString('base64');
            })
            .join('/');
    }

    return path
        .split('?')
        .map((part, index) => {
            return index === 0 ? encodeAndAsssemble(part, '/') : encodeAndAsssemble(part, '&');
        }).join('/');
}