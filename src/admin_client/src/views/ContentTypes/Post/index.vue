<template>
  <v-container>
    <div v-if="fields">
      <div v-for="(field,index) in fields" :key="index">
        <Textfield v-if="field.type == 'Text'" :label="field.title" />        
      </div>
    </div>
  </v-container>
</template>

<script>
import Textfield from '@/components/Fields/Text';
import { CONTENT_TYPE_FIELDS } from '@/store/types';

export default {
  components: {
    Textfield
  },
  props: [
    'link'
  ],
  computed: {
    fields () {
      return this.$store.getters[CONTENT_TYPE_FIELDS][this.link];
    }
  },
  mounted () {}
}
</script>
