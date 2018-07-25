<template>
  <v-list>
    <v-list-group>
      <v-list-tile slot="activator">
        <v-list-tile-title>Featured Image</v-list-tile-title>
      </v-list-tile>
      <div class="px-3">
        <FeaturedImageField :post-featured-image="postFeaturedImage" @handleCloseFeaturedImg="handleCloseFeaturedImg" @handleChangeFeaturedImg="handleChangeFeaturedImg" />
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
</template>

<script>
import { POST_FIELD_FEATURED_IMAGE, POST_FIELD_PERMALINK } from '@/store/types';
import FeaturedImageField from '@/components/Post/FeaturedImageField';

export default {
  components: {
    FeaturedImageField
  },
  computed: {
    postFeaturedImage() {
      return this.$store.getters[POST_FIELD_FEATURED_IMAGE];
    },
    postPermalink() {
      return this.$store.getters[POST_FIELD_PERMALINK];
    }
  },
  methods: {
    handleChangeFeaturedImg(e) {
      const reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = event => {
        this.$store.commit(POST_FIELD_FEATURED_IMAGE, event.target.result);
      };
    },
    handleCloseFeaturedImg(refs) {
      this.$store.commit(POST_FIELD_FEATURED_IMAGE, null);
      refs.value = null;
    }
  }
};
</script>

<style lang="scss" scoped>
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
</style>
