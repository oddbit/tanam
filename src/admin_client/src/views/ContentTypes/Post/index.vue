<template>
  <v-container>
    <v-layout row wrap>
      <div v-if="fields" style="width:100%">
        <div v-for="(field,index) in fields" :key="index">

          <v-flex v-if="field.type === 'text'">
            <text-field @input="textField" :label="field.title" />
          </v-flex>

          <v-flex v-if="field.type === 'image'">
            <image-field v-on:changeImage="image($event)" :label="field.title" :name="field.title" />
          </v-flex>

          <v-flex v-if="field.type === 'date'">
            <date v-on:changeDate="date($event)" :label="field.title" :name="field.title" />
          </v-flex>

          <v-flex v-if="field.type === 'time'">
            <Time v-if="field.type === 'time'" v-on:changeTime="time($event)" :label="field.title" :name="field.title"/>
          </v-flex>

          <v-flex v-if="field.type ==='wysiwyg'">
            <WYSIWYG v-if="field.type ==='wysiwyg'" v-on:changeContent="wysiwyg($event)"/>
          </v-flex>

          <v-flex v-if="field.type === 'select'">
            <select-field v-if="field.type === 'select'" v-on:changeSelected="selected($event)" :label="field.title" :items="field.items"/>
          </v-flex>

          <v-flex v-if="field.type === 'radio'">
            <radio-field v-if="field.type === 'radio'" @change="radio" :label="field.title" :items="field.items"/>
          </v-flex>

          <v-flex v-if="field.type === 'checkbox'">
            <checkbox-field v-if="field.type === 'checkbox'" v-on:changeCheckbox="checkbox($event)" :label="field.title" :items="field.items" />
          </v-flex>

          <v-flex v-if="field.type === 'password'">
            <password-field @input="password" :label="field.title"/>
          </v-flex>

          <v-flex v-if="field.type === 'email'">
            <email-field @input="email" :label="field.title"/>
          </v-flex>

          <v-flex v-if="field.type === 'number'">
            <number @input="number" :label="field.title"/>
          </v-flex>

          <v-flex v-if="field.type === 'textarea'">
            <textarea-field @input="textarea" :label="field.title"/>
          </v-flex>
        </div>
      </div>
    </v-layout>
  </v-container>
</template>

<script>
import { CONTENT_TYPES_GET } from '@/store/types';

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
  methods: {
    wysiwyg(content) {
      console.log('quil content:');
      console.log(content);
    },
    textField(value) {
      console.log(value);
    },
    date(date) {
      console.log(date);
    },
    time(time) {
      console.log(time);
    },
    selected(select) {
      console.log(select);
    },
    password(password) {
      console.log(password);
    },
    email(email) {
      console.log(email);
    },
    number(number) {
      console.log(number);
    },
    textarea(textarea) {
      console.log(textarea);
    },
    radio(radio) {
      console.log(radio);
    },
    checkbox(checbox) {
      console.log(checbox);
    },
    image(image) {
      console.log(image);
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

