<template>
  <v-container>
    <v-layout v-if="fields" wrap justify-center>
      <v-flex xs12 md8>
        <v-layout wrap>
          <v-flex 
            v-for="(field,index) in fields" 
            :key="index" 
            xs12 
            class="my-2">

            <list 
              v-if="field.type === 'list'" 
              :label="field.name"
              :value="postFields[field.key]"
              @changeList="list($event, field.key)"/>

            <text-field 
              v-if="field.type === 'text'" 
              :label="field.name" 
              :value="postFields[field.key]" 
              @input="textField($event, field.key)" />

            <image-field 
              v-if="field.type === 'image'" 
              :label="field.name" 
              :name="field.key" 
              :value="postFields[field.key]"
              @changeImage="image($event, field.key)" />

            <date 
              v-if="field.type === 'date'" 
              :label="field.name" 
              :name="field.key" 
              :value="postFields[field.key]"
              @changeDate="date($event, field.key)" />

            <Time 
              v-if="field.type === 'time'" 
              :label="field.name" 
              :name="field.key"
              :value="postFields[field.key]"
              @changeTime="time($event, field.key)" />

            <WYSIWYG 
              v-if="field.type ==='wysiwyg'" 
              :label="field.name" 
              :value="postFields[field.key]" 
              @changeContent="wysiwyg($event, field.key)" />

            <select-field 
              v-if="field.type === 'select'" 
              :label="field.name" 
              :items="field.item"
              :value="postFields[field.key]"
              @changeSelected="selected($event, field.key)" />

            <radio-field 
              v-if="field.type === 'radio'" 
              :label="field.name" 
              :items="field.item" 
              :value="postFields[field.key]"
              @change="radio($event, field.key)" />

            <checkbox-field 
              v-if="field.type === 'checkbox'" 
              :label="field.name" 
              :items="field.items" 
              @changeCheckbox="checkbox($event, field.key)" />

            <password-field v-if="field.type === 'password'" :label="field.name" @input="password($event, field.key)" />

            <email-field v-if="field.type === 'email'" :label="field.name" @input="email($event, field.key)" />

            <number v-if="field.type === 'number'" :label="field.name" @input="number($event, field.key)" />

            <textarea-field 
              v-if="field.type === 'textarea'" 
              :label="field.name" 
              :value="postFields[field.key]" 
              @input="textarea($event, field.key)" />

          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import {
  CONTENT_TYPE_GET,
  POST_IS_SUBMITTING,
  POST_IS_EDITED_MODE,
  POST_PUBLISH,
  POST_FIELD_TITLE,
  POST_FIELD_PERMALINK,
  POST_FIELD_PERMALINK_EDIT,
  POST_FIELD_STATUS,
  POST_SINGLE
} from '@/store/types';

export default {
  components: {
    List: () => import('@/components/Fields/List'),
    CheckboxField: () => import('@/components/Fields/Checkbox'),
    Date: () => import('@/components/Fields/Date'),
    DateTime: () => import('@/components/Fields/DateTime'),
    EmailField: () => import('@/components/Fields/Email'),
    ImageField: () => import('@/components/Fields/Image'),
    Number: () => import('@/components/Fields/Number'),
    RadioField: () => import('@/components/Fields/Radio'),
    PasswordField: () => import('@/components/Fields/Password'),
    SelectField: () => import('@/components/Fields/Select'),
    TextField: () => import('@/components/Fields/Text'),
    TextareaField: () => import('@/components/Fields/Textarea'),
    Time: () => import('@/components/Fields/Time'),
    WYSIWYG: () => import('@/components/Fields/WYSIWYG')
  },
  props: {
    ctKey: {
      type: String,
      default: 'key'
    },
    postID: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    postFields: {},
    imageFiles: {}
  }),
  computed: {
    fields() {
      const ct = this.$store.getters[CONTENT_TYPE_GET];
      if (ct && ct[this.ctKey]) {
        return ct[this.ctKey].fields;
      }
      return null;
    },
    isSubmitting() {
      return this.$store.getters[POST_IS_SUBMITTING];
    },
    isEditedMode() {
      return this.$store.getters[POST_IS_EDITED_MODE];
    }
  },
  watch: {
    isSubmitting(val) {
      if (val) {
        this.publishPost();
      }
    }
  },
  created() {
    if (this.postID !== '') {
      this.$store.commit(POST_IS_EDITED_MODE, true);
      this.$store
        .dispatch(POST_SINGLE, { ctKey: this.ctKey, postID: this.postID })
        .then(doc => {
          this.$store.commit(POST_FIELD_STATUS, doc.status);
          this.$store.commit(POST_FIELD_PERMALINK_EDIT, doc.permalink);
          this.postFields = doc.data;
          this.$store.commit(POST_FIELD_TITLE, doc.data.title);
        })
        .catch(() => console.log('error'));
    }
  },
  methods: {
    async publishPost() {
      try {
        await this.$store.dispatch(POST_PUBLISH, {
          contentType: this.ctKey,
          postFields: this.postFields,
          imageFiles: this.imageFiles,
          ...(POST_IS_EDITED_MODE ? { uid: this.postID } : null)
        });
        this.$store.commit(POST_IS_SUBMITTING, false);
        this.$store.commit(POST_IS_EDITED_MODE, false);
        this.$router.push(`/content-type/${this.ctKey}`);
      } catch (error) {
        this.$store.commit(POST_IS_SUBMITTING, false);
        this.$store.commit(POST_IS_EDITED_MODE, false);
      }
    },
    list(content, key) {
      this.postFields[key] = content;
    },
    wysiwyg(content, key) {
      this.postFields[key] = content;
    },
    textField(value, key) {
      if (key === 'title') {
        this.$store.commit(POST_FIELD_TITLE, value);
        this.$store.commit(POST_FIELD_PERMALINK, value);
      }
      this.postFields[key] = value;
    },
    date(date, key) {
      this.postFields[key] = date;
    },
    time(time, key) {
      this.postFields[key] = time;
    },
    selected(select, key) {
      this.postFields[key] = select;
    },
    password(password, key) {
      this.postFields[key] = password;
    },
    email(email, key) {
      this.postFields[key] = email;
    },
    number(number, key) {
      this.postFields[key] = number;
    },
    textarea(textarea, key) {
      this.postFields[key] = textarea;
    },
    radio(radio, key) {
      this.postFields[key] = radio;
    },
    checkbox(checbox, key) {
      this.postFields[key] = checbox;
    },
    image(image, key) {
      this.imageFiles[key] = image;
      if (this.postFields && this.postFields[key] && image === null)
        this.postFields[key] = image;
    }
  }
};
</script>
