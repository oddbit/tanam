<template>
  <v-toolbar
    height="48"
    app
    fixed
    clipped-left
    clipped-right
    color="primary"
    class="elevation-2"
    dark>
    <v-btn icon @click="$router.back()"><v-icon>close</v-icon></v-btn>
    <v-spacer />
    <v-btn flat icon @click="handleToggleDrawer">
      <v-icon>settings</v-icon>
    </v-btn>
    <v-btn 
      :disabled="postTitle === '' || !postTitle"
      :loading="isSubmitting"
      light 
      @click="handleClickSubmit">
      {{ isEditedMode ? 'Update' : 'Publish' }}
    </v-btn>
  </v-toolbar>
</template>

<script>
import {
  POST_IS_EDITED_MODE,
  POST_IS_SHOW_DRAWER,
  POST_IS_SUBMITTING,
  POST_FIELD_TITLE
} from '@/store/types';

export default {
  computed: {
    isEditedMode() {
      return this.$store.getters[POST_IS_EDITED_MODE];
    },
    isSubmitting() {
      return this.$store.getters[POST_IS_SUBMITTING];
    },
    postTitle() {
      return this.$store.getters[POST_FIELD_TITLE];
    }
  },
  methods: {
    handleToggleDrawer() {
      this.$store.commit(POST_IS_SHOW_DRAWER);
    },
    handleClickSubmit() {
      this.$store.commit(POST_IS_SUBMITTING, true);
    }
  }
};
</script>
