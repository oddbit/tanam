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

            <text-field v-if="field.type === 'text'" :label="field.name" @input="textField($event, field.key)" />

            <image-field 
              v-if="field.type === 'image'" 
              :label="field.name" 
              :name="field.key" 
              @changeImage="image($event, field.key)" />

            <date 
              v-if="field.type === 'date'" 
              :label="field.name" 
              :name="field.key" 
              @changeDate="date($event, field.key)" />

            <Time 
              v-if="field.type === 'time'" 
              :label="field.name" 
              :name="field.key" 
              @changeTime="time($event, field.key)" />

            <WYSIWYG v-if="field.type ==='wysiwyg'" :label="field.name" @changeContent="wysiwyg($event, field.key)" />

            <select-field 
              v-if="field.type === 'select'" 
              :label="field.name" 
              :items="field.items" 
              @changeSelected="selected($event, field.key)" />

            <radio-field 
              v-if="field.type === 'radio'" 
              :label="field.name" 
              :items="field.items" 
              @change="radio($event, field.key)" />

            <checkbox-field 
              v-if="field.type === 'checkbox'" 
              :label="field.name" 
              :items="field.items" 
              @changeCheckbox="checkbox($event, field.key)" />

            <password-field v-if="field.type === 'password'" :label="field.name" @input="password($event, field.key)" />

            <email-field v-if="field.type === 'email'" :label="field.name" @input="email($event, field.key)" />

            <number v-if="field.type === 'number'" :label="field.name" @input="number($event, field.key)" />

            <textarea-field v-if="field.type === 'textarea'" :label="field.name" @input="textarea($event, field.key)" />

          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import {
  CONTENT_TYPE_GET,
  POST_PUBLISH,
  POST_IS_SUBMITTING,
  POST_FIELD_TITLE,
  POST_FIELD_PERMALINK
} from '@/store/types';

export default {
  components: {
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
    }
  },
  watch: {
    isSubmitting(val) {
      if (val) {
        this.publishPost();
      }
    }
  },
  mounted() {
    // this.$store.commit(POST_MODE, 'new');
  },
  methods: {
    async publishPost() {
      try {
        await this.$store.dispatch(POST_PUBLISH, {
          contentType: this.ctKey,
          postFields: this.postFields,
          imageFiles: this.imageFiles
        });
        this.$store.commit(POST_IS_SUBMITTING, false);
        this.$router.push(`/content-type/${this.ctKey}`);
      } catch (error) {
        this.$store.commit(POST_IS_SUBMITTING, false);
      }
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
    }
  }
};
</script>
