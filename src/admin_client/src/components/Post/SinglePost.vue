<template>
  <div class="wrapper">
    <div
      class="editor-toolbar-wrapper" 
      :class="{'drawer-off': !drawer}">
      <v-layout justify-center>
        <v-flex xs12>
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
                <option selected="selected" /><option value="#e60000" /><option value="#ff9900" /><option value="#ffff00" /><option value="#008a00" /><option value="#0066cc" /><option value="#9933ff" /><option value="#ffffff" /><option value="#facccc" /><option value="#ffebcc" /><option value="#ffffcc" /><option value="#cce8cc" /><option value="#cce0f5" /><option value="#ebd6ff" /><option value="#bbbbbb" /><option value="#f06666" /><option value="#ffc266" /><option value="#ffff66" /><option value="#66b966" /><option value="#66a3e0" /><option value="#c285ff" /><option value="#888888" /><option value="#a10000" /><option value="#b26b00" /><option value="#b2b200" /><option value="#006100" /><option value="#0047b2" /><option value="#6b24b2" /><option value="#444444" /><option value="#5c0000" /><option value="#663d00" /><option value="#666600" /><option value="#003700" /><option value="#002966" /><option value="#3d1466" />
              </select>
              <select class="ql-background">
                <option selected="selected" /><option value="#e60000" /><option value="#ff9900" /><option value="#ffff00" /><option value="#008a00" /><option value="#0066cc" /><option value="#9933ff" /><option value="#ffffff" /><option value="#facccc" /><option value="#ffebcc" /><option value="#ffffcc" /><option value="#cce8cc" /><option value="#cce0f5" /><option value="#ebd6ff" /><option value="#bbbbbb" /><option value="#f06666" /><option value="#ffc266" /><option value="#ffff66" /><option value="#66b966" /><option value="#66a3e0" /><option value="#c285ff" /><option value="#888888" /><option value="#a10000" /><option value="#b26b00" /><option value="#b2b200" /><option value="#006100" /><option value="#0047b2" /><option value="#6b24b2" /><option value="#444444" /><option value="#5c0000" /><option value="#663d00" /><option value="#666600" /><option value="#003700" /><option value="#002966" /><option value="#3d1466" />
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
        </v-flex>
      </v-layout>
    </div>
    <v-layout justify-center fill-height class="content-wrapper">
      <v-flex xs12 md8>
        <v-layout>
          <v-flex xs12>
            <v-text-field
              placeholder="Title"
              class="post-title-field"
              v-model="postTitle"
              solo
              flat
              multi-line
              auto-grow
              rows="1" />
          </v-flex>
        </v-layout>
        <v-layout v-if="postFeaturedImage">
          <v-flex x12>
            <div class="featured-img-wrapper px-3 mb-3"><img :src="postFeaturedImage"></div>
          </v-flex>
        </v-layout>
        <v-layout>
          <v-flex xs12>
            <div id="editor" class="editor-content" />
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import {
  POST_FIELD_TITLE,
  POST_FIELD_FEATURED_IMAGE,
  POST_FIELD_BODY,
  TOGGLE_DRAWER_POST,
  POST_MODE
} from '@/store/types';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

export default {
  data: () => ({
    title: null,
    quill: null,
    quillContentOnce: false
  }),
  computed: {
    postMode() {
      return this.$store.getters[POST_MODE];
    },
    slug() {
      return this.$route.params.slug;
    },
    drawer() {
      return this.$store.getters[TOGGLE_DRAWER_POST];
    },
    postTitle: {
      get() {
        return this.$store.getters[POST_FIELD_TITLE];
      },
      set(val) {
        this.$store.commit(POST_FIELD_TITLE, val);
      }
    },
    postFeaturedImage() {
      return this.$store.getters[POST_FIELD_FEATURED_IMAGE];
    },
    postContent() {
      return this.$store.getters[POST_FIELD_BODY];
    }
  },
  mounted() {
    this.quill = new Quill('#editor', {
      theme: 'snow',
      modules: {
        toolbar: '#editor-toolbar'
      },
      placeholder: 'Write here...'
    });

    this.quill.on('editor-change', () => {
      this.$store.commit(POST_FIELD_BODY, this.quill.getContents().ops);
    });
  },
  watch: {
    postContent(val) {
      if (!this.quillContentOnce && this.postMode === 'edit') {
        this.quillContentOnce = true;
        this.quill.clipboard.dangerouslyPasteHTML(0, val);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.wrapper {
  height: 100%;
}

.editor-toolbar-wrapper {
  background: rgba(255, 255, 255, 0.9);
  border-bottom: 1px solid #eee;
  display: flex;
  position: fixed;
  width: 100%;
  z-index: 1;

  #editor-toolbar {
    border: none;
    align-items: center;
  }
}

.featured-img-wrapper {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    max-width: 100%;
  }
}

.content-wrapper {
  padding: 8em 0;
}

.editor-content {
  border: none;
}

@media screen and (min-width: 960px) {
  .editor-toolbar-wrapper {
    padding-right: 300px;
    transition: 0.2s;

    #editor-toolbar {
      display: flex;
      justify-content: center;
    }
  }

  .drawer-off {
    padding-right: 0;
  }
}
</style>

<style lang="scss">
.post-title-field {
  background: transparent !important;
  margin-bottom: 2em;

  textarea {
    font-size: 32px;
    font-weight: bold;
    color: #2c3e50 !important;
  }
}
</style>
