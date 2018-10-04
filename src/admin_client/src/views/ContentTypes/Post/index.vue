<template>
  <v-container>
    <v-layout row wrap>
      <div v-if="fields" style="width:100%">
        <div v-for="(field,index) in fields" :key="index">

          <v-flex v-if="field.type === 'text'">
            <text-field @input="textField($event, field.title)" :label="field.title" />
          </v-flex>

          <v-flex v-if="field.type === 'image'">
            <image-field v-on:changeImage="image($event, field.title)" :label="field.title" :name="field.title" />
          </v-flex>

          <v-flex v-if="field.type === 'date'">
            <date v-on:changeDate="date($event, field.title)" :label="field.title" :name="field.title" />
          </v-flex>

          <v-flex v-if="field.type === 'time'">
            <Time v-if="field.type === 'time'" v-on:changeTime="time($event, field.title)" :label="field.title" :name="field.title"/>
          </v-flex>

          <v-flex v-if="field.type ==='wysiwyg'">
            <WYSIWYG v-if="field.type ==='wysiwyg'" v-on:changeContent="wysiwyg($event, field.title)"/>
          </v-flex>

          <v-flex v-if="field.type === 'select'">
            <select-field v-if="field.type === 'select'" v-on:changeSelected="selected($event, field.title)" :label="field.title" :items="field.items"/>
          </v-flex>

          <v-flex v-if="field.type === 'radio'">
            <radio-field v-if="field.type === 'radio'" @change="radio($event, field.title)" :label="field.title" :items="field.items"/>
          </v-flex>

          <v-flex v-if="field.type === 'checkbox'">
            <checkbox-field v-if="field.type === 'checkbox'" v-on:changeCheckbox="checkbox($event, field.title)" :label="field.title" :items="field.items" />
          </v-flex>

          <v-flex v-if="field.type === 'password'">
            <password-field @input="password($event, field.title)" :label="field.title"/>
          </v-flex>

          <v-flex v-if="field.type === 'email'">
            <email-field @input="email($event, field.title)" :label="field.title"/>
          </v-flex>

          <v-flex v-if="field.type === 'number'">
            <number @input="number($event, field.title)" :label="field.title"/>
          </v-flex>

          <v-flex v-if="field.type === 'textarea'">
            <textarea-field @input="textarea($event, field.title)" :label="field.title"/>
          </v-flex>
        </div>
      </div>
      <v-btn @click="addPost">POST</v-btn>
    </v-layout>
  </v-container>
</template>

<script>
import { CONTENT_TYPES_GET, CONTENT_TYPES_POST_ADD } from '@/store/types';

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
    link: {
      type: String,
      default: 'name'
    }
  },
  data: () => ({
    post: {}
  }),
  methods: {
    addPost() {
      console.log(this.post);
      console.log(this.link);
      this.$store.dispatch(CONTENT_TYPES_POST_ADD, {
        contentType: this.link,
        post: this.post
      });
    },
    wysiwyg(content, prop) {
      console.log('quil content:');
      console.log(content);
      this.post[prop.toLowerCase()] = content;
    },
    textField(value, prop) {
      console.log(value);
      console.log(prop);
      this.post[prop.toLowerCase()] = value;
    },
    date(date, prop) {
      console.log(date);
      this.post[prop.toLowerCase()] = date;
    },
    time(time, prop) {
      console.log(time);
      this.post[prop.toLowerCase()] = time;
    },
    selected(select, prop) {
      console.log(select);
      this.post[prop.toLowerCase()] = select;
    },
    password(password, prop) {
      console.log(password);
      this.post[prop.toLowerCase()] = password;
    },
    email(email, prop) {
      console.log(email);
      this.post[prop.toLowerCase()] = email;
    },
    number(number, prop) {
      console.log(number);
      this.post[prop.toLowerCase()] = number;
    },
    textarea(textarea, prop) {
      console.log(textarea);
      this.post[prop.toLowerCase()] = textarea;
    },
    radio(radio, prop) {
      console.log(radio);
      this.post[prop.toLowerCase()] = radio;
    },
    checkbox(checbox, prop) {
      console.log(checbox);
      this.post[prop.toLowerCase()] = checbox;
    },
    image(image, prop) {
      console.log(image);
      this.post[prop.toLowerCase()] = 'static/image/link';
    }
  },
  computed: {
    fields() {
      const fields = this.$store.getters[CONTENT_TYPES_GET][this.link];
      if (fields && fields.fields) {
        return fields.fields;
      }
      return fields;
    }
  }
};
</script>

<style scoped>
.tes {
  width: 100%;
}
</style>

