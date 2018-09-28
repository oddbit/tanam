<template>
  <v-container>
    <Textfield label="Helo"/>
  </v-container>
</template>

<script>
import Textfield from '@/components/Fields/Text';
import { CONTENT_TYPE_FIELD, CONTENT_TYPE_FIELDS } from '@/store/types';

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
  mounted () {
    this.$store.dispatch(CONTENT_TYPE_FIELD, this.link);    
  }
}
</script>
