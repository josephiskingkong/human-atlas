import DOMPurify from 'dompurify';

const clear = (html) => {
    const cleanHtml = DOMPurify.sanitize(html, {
        ALLOWED_TAGS: ['u', 'a', 'b', 'i']
    });
    console.log(html);
    console.log(cleanHtml);

    return cleanHtml;
};

export default clear;