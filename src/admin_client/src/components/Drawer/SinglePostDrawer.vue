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
import { POST_DIALOG_DELETE, TOGGLE_DRAWER_POST } from '@/store/types';
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

.datetime-title {
  color: #333;
}

.datetime-wrapper {
  display: flex;
  justify-content: space-between;

  .date-wrapper {
    width: 60%;
  }

  .time-wrapper {
    width: 35%;
  }
}

.featured-img-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ddd;
  position: relative;
  padding-top: 56.25%;
  margin: 16px 0;

  .btn-set {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    margin: 0;
  }

  .input-img {
    display: none;
  }

  .btn-close {
    position: absolute;
    top: -16px;
    right: -16px;
  }

  .img-wrapper {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}

.delete-wrapper {
  margin-top: auto;

  .btn {
    height: 48px !important;
  }
}
</style>
