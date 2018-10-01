<template>
  <v-container>
    <div v-if="fields">
      <div v-for="(field,index) in fields" :key="index">
        <Textfield v-if="field.type == 'text'" :label="field.title" />        
        <!-- {{field}} -->
      </div>
    </div>
    <!-- {{fields}} -->
  </v-container>
</template>

<script>
import Textfield from '@/components/Fields/Text';
import { CONTENT_TYPES_GET } from '@/store/types';

export default {
  components: {
    Textfield
  },
  props: ['link'],
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
