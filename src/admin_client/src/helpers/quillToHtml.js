import QuillToHtml from 'quill-delta-to-html';

export default delta => {
  const converter = new QuillToHtml(delta);
  return converter.convert();
};
