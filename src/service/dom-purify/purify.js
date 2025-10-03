import DOMPurify from "dompurify";

const clear = (html) => {
  const cleanHtml = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ["u", "a", "b", "i"],
  });

  return cleanHtml;
};

export default clear;
