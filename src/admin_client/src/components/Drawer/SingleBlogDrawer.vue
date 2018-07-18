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
      <v-list>
        <v-list-group>
          <v-list-tile slot="activator">
            <v-list-tile-title>Featured Image</v-list-tile-title>
          </v-list-tile>
          <div class="px-3">
            <div class="featured-img-wrapper">
              <div v-if="postFeaturedImage" class="img-wrapper"><img :src="postFeaturedImage"></div>
              <v-btn v-if="!postFeaturedImage" class="btn-set" @click="$refs.featuredImg.click()">Set Featured Image</v-btn>
              <v-btn 
                v-else 
                icon 
                small
                @click="handleCloseFeaturedImg"
                class="btn-close elevation-4" 
                color="white"><v-icon small>close</v-icon></v-btn>
              <input 
                ref="featuredImg" 
                type="file" 
                @change="handleChangeFeaturedImg" 
                class="input-img">
            </div>
          </div>
        </v-list-group>
        <v-list-group>
          <v-list-tile slot="activator">
            <v-list-tile-title>Permalink</v-list-tile-title>
          </v-list-tile>
          <div class="px-3">
            <v-text-field 
              readonly 
              placeholder="-"
              :value="postPermalink" />
          </div>
        </v-list-group>
      </v-list>
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
import {
  BLOG_POST_FEATURED_IMAGE,
  BLOG_POST_PERMALINK,
  BLOG_POST_DIALOG_DELETE,
  BLOG_POST_ID
} from '@/store/types';
import DialogDelete from '@/components/Blog/DialogDelete';

export default {
  components: {
    DialogDelete
  },
  computed: {
    drawer() {
      return this.$store.state.drawer.statusEventPost;
    },
    postFeaturedImage() {
      return this.$store.getters[BLOG_POST_FEATURED_IMAGE];
    },
    postPermalink() {
      return this.$store.getters[BLOG_POST_PERMALINK];
    }
  },
  methods: {
    handleChangeFeaturedImg(e) {
      const reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = event => {
        this.$store.commit(BLOG_POST_FEATURED_IMAGE, event.target.result);
      };
    },
    handleCloseFeaturedImg() {
      this.$store.commit(BLOG_POST_FEATURED_IMAGE, null);
      this.$refs.featuredImg.value = null;
    },
    handleInputDrawer(val) {
      this.$store.commit('drawer/toggleDrawerEventPost', val);
    },
    handleClickDelete() {
      this.$store.commit(BLOG_POST_DIALOG_DELETE, {
        dialogDelete: true,
        id: this.$store.getters[BLOG_POST_ID]
      });
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
