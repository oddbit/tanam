<template>
  <v-container>
    <div v-if="fields">
      <div v-for="(field,index) in fields" :key="index">
        <text-field v-if="field.type === 'text'" :label="field.title" />
        <image-field v-if="field.type === 'image'" :label="field.title" :name="field.title" />
        <date v-if="field.type === 'date'" :label="field.label" :name="field.title" />
      </div>
    </div>
  </v-container>
</template>

<script>
import { CONTENT_TYPES_GET } from '@/store/types';

export default {
  components: {
    TextField: () => import('@/components/Fields/Text'),
    ImageField: () => import('@/components/Fields/Image'),
    Date: () => import('@/components/Fields/Date')
  },
  props: {
    link: {
      type: String,
      default: 'name'
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
