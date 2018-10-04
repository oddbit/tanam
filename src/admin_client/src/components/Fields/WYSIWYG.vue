<template>
  <div class="wrap">
    <div id="editor-toolbar">
      <span class="ql-formats">
        <select class="ql-header">
          <option value="1" />
          <option value="2" />
          <option value="3" />
          <option value="4" />
          <option value="5" />
          <option value="6" />
          <option selected />
        </select>
      </span>
      <span class="ql-formats">
        <button class="ql-bold" />
        <button class="ql-italic" />
        <button class="ql-underline" />
        <button class="ql-strike" />
      </span>
      <span class="ql-formats">
        <button class="ql-script" value="sub" />
        <button class="ql-script" value="super" />
      </span>
      <span class="ql-formats">
        <select class="ql-color">
          <option selected="selected" />
          <option value="#e60000" />
          <option value="#ff9900" />
          <option value="#ffff00" />
          <option value="#008a00" />
          <option value="#0066cc" />
          <option value="#9933ff" />
          <option value="#ffffff" />
          <option value="#facccc" />
          <option value="#ffebcc" />
          <option value="#ffffcc" />
          <option value="#cce8cc" />
          <option value="#cce0f5" />
          <option value="#ebd6ff" />
          <option value="#bbbbbb" />
          <option value="#f06666" />
          <option value="#ffc266" />
          <option value="#ffff66" />
          <option value="#66b966" />
          <option value="#66a3e0" />
          <option value="#c285ff" />
          <option value="#888888" />
          <option value="#a10000" />
          <option value="#b26b00" />
          <option value="#b2b200" />
          <option value="#006100" />
          <option value="#0047b2" />
          <option value="#6b24b2" />
          <option value="#444444" />
          <option value="#5c0000" />
          <option value="#663d00" />
          <option value="#666600" />
          <option value="#003700" />
          <option value="#002966" />
          <option value="#3d1466" />
        </select>
        <select class="ql-background">
          <option selected="selected" />
          <option value="#e60000" />
          <option value="#ff9900" />
          <option value="#ffff00" />
          <option value="#008a00" />
          <option value="#0066cc" />
          <option value="#9933ff" />
          <option value="#ffffff" />
          <option value="#facccc" />
          <option value="#ffebcc" />
          <option value="#ffffcc" />
          <option value="#cce8cc" />
          <option value="#cce0f5" />
          <option value="#ebd6ff" />
          <option value="#bbbbbb" />
          <option value="#f06666" />
          <option value="#ffc266" />
          <option value="#ffff66" />
          <option value="#66b966" />
          <option value="#66a3e0" />
          <option value="#c285ff" />
          <option value="#888888" />
          <option value="#a10000" />
          <option value="#b26b00" />
          <option value="#b2b200" />
          <option value="#006100" />
          <option value="#0047b2" />
          <option value="#6b24b2" />
          <option value="#444444" />
          <option value="#5c0000" />
          <option value="#663d00" />
          <option value="#666600" />
          <option value="#003700" />
          <option value="#002966" />
          <option value="#3d1466" />
        </select>
      </span>
      <span class="ql-formats">
        <button class="ql-list" value="ordered" />
        <button class="ql-list" value="bullet" />
        <button class="ql-indent" value="-1" />
        <button class="ql-indent" value="+1" />
        <select class="ql-align">
          <option selected />
          <option value="center" />
          <option value="right" />
          <option value="justify" />
        </select>
      </span>
      <span class="ql-formats">
        <button class="ql-blockquote" />
        <button class="ql-code" />
      </span>
      <span class="ql-formats">
        <button class="ql-link" />
        <button class="ql-image" />
        <button class="ql-video" />
      </span>
      <span class="ql-formats">
        <button class="ql-clean" />
      </span>
    </div>
    <div id="editor"
      :content="content"
      class="editor-content"
    />
  </div>
</template>

<script>
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
export default {
  props: {
    label: {
      type: String,
      default: 'Text'
    },
    value: {
      type: String,
      default: null
    }
  },
  data: () => ({
    quill: null,
    quillContentOnce: false,
    content: ''
  }),
  mounted() {
    const quillSettings = {
      theme: 'snow',
      modules: {
        toolbar: '#editor-toolbar'
      },
      placeholder: 'Write here...'
    };
    const editor = new Quill('#editor', quillSettings);

    editor.on('editor-change', () => {
      this.content = editor.root.innerHTML;
      this.$emit('changeContent', this.content)
    });
  }
}
</script>

<style scoped>
  .wrap {
    margin-bottom: 20px;
  }
</style>

