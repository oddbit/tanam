<template>
  <ContentTypesIndex :link='link' />
</template>

<script>
import ContentTypesIndex from '@/components/ContentTypes/ContentTypesIndex';

export default {
  components: {
    ContentTypesIndex
  },
  props: {
    link: {
      type: String,
      default: '/'
    }
  }
};
</script>
