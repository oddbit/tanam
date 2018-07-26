<template>
  <v-btn class="ma-0" color="white" :to="to">
    {{ text }}
    <v-icon right>{{ icon }}</v-icon>
  </v-btn>
</template>

<script>
export default {
  props: {
    to: {
      type: String,
      default: '/'
    },
    text: {
      type: String,
      default: 'create post'
    },
    icon: {
      type: String,
      default: 'library_books'
    }
  }
};
</script>
