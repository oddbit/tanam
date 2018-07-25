<template>
  <div>
    <v-navigation-drawer
      :value="drawer"
      :clipped="$mq === 'desktop'"
      right
      fixed
      app
      @input="handleInputDrawer"
      class="drawer-wrapper">
      <EventDrawerList />
      <div class="delete-wrapper">
        <v-divider />
        <v-btn 
          v-if="isShowBtnDelete"
          flat 
          class="ma-0" 
          block
          @click="handleClickDelete"><v-icon left>delete</v-icon>Delete</v-btn>
      </div>
    </v-navigation-drawer>
    <DialogDelete />
  </div>
</template>

<script>
import {
  POST_DIALOG_DELETE,
  TOGGLE_DRAWER_POST,
  POST_MODE
} from '@/store/types';
import EventDrawerList from '@/components/Event/DrawerList';
import DialogDelete from '@/components/Post/DialogDelete';

export default {
  components: {
    EventDrawerList,
    DialogDelete
  },
  computed: {
    drawer() {
      return this.$store.getters[TOGGLE_DRAWER_POST];
    },
    isShowBtnDelete() {
      return this.$store.getters[POST_MODE] === 'edit' ? true : false;
    }
  },
  methods: {
    handleInputDrawer(val) {
      this.$store.commit(TOGGLE_DRAWER_POST, val);
    },
    handleClickDelete() {
      this.$store.commit(POST_DIALOG_DELETE, true);
    }
  }
};
</script>

<style lang="scss" scoped>
.drawer-wrapper {
  display: flex;
  flex-direction: column;
  padding-bottom: 0;
}

.delete-wrapper {
  margin-top: auto;

  .btn {
    height: 48px !important;
  }
}
</style>
