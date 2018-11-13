<template>
  <v-navigation-drawer
    :value="drawerStatus"
    fixed
    app
    floating
    width="260"
    class="wrapper"
    @input="inputDrawer">
    <slot name="drawer" />
  </v-navigation-drawer>
</template>

<script>
import { TOGGLE_DRAWER } from '@/store/types';
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters({
      drawer: [TOGGLE_DRAWER]
    }),
    drawerStatus() {
      if (this.$mq === 'desktop') {
        return true;
      }
      return this.drawer;
    }
  },
  methods: {
    inputDrawer(val) {
      if (!val) {
        this.$store.commit(TOGGLE_DRAWER, false);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.wrapper {
  overflow-y: hidden !important;
  display: flex;
  flex-direction: column;
  min-height: 100%;
}
</style>
