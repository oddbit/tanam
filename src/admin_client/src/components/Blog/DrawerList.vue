<template>
  <v-list>
    <DrawerSettings>
      <template slot="title">Featured Image</template>
      <FeaturedImageField :post-featured-image="postFeaturedImage" @handleCloseFeaturedImg="handleCloseFeaturedImg" @handleChangeFeaturedImg="handleChangeFeaturedImg" />
    </DrawerSettings>
    <DrawerSettings>
      <template slot="title">Permalink</template>
      <v-text-field 
        readonly 
        placeholder="-"
        :value="postPermalink" />
    </DrawerSettings>
    <DrawerSettings>
      <template slot="title">Template</template>
      <v-select
        :items="['blog']"
        label="Template"
        solo
        v-model="postTemplate"
      />
    </DrawerSettings>
    <DrawerSettings>
      <template slot="title">Tags</template>
      <v-select
        :items="[]"
        label="Tags"
        multiple
        chips
        tags
        v-model="postTags"
      />
    </DrawerSettings>
  </v-list>
</template>

<script>
import {
  POST_FIELD_FEATURED_IMAGE,
  POST_FIELD_TEMPLATE,
  POST_FIELD_TAGS
} from '@/store/types';
import FeaturedImageField from '@/components/Post/FeaturedImageField';
import DrawerSettings from '@/components/Shared/DrawerSettings';

export default {
  components: {
    FeaturedImageField,
    DrawerSettings
  },
  computed: {
    postState() {
      return this.$store.state.singlePost;
    },
    postFeaturedImage() {
      return this.$store.getters[POST_FIELD_FEATURED_IMAGE];
    },
    postPermalink() {
      return this.postState.permalink;
    },
    postTemplate: {
      get() {
        return this.postState.template;
      },
      set(val) {
        this.$store.commit(POST_FIELD_TEMPLATE, val);
      }
    },
    postTags: {
      get() {
        return this.postState.tags;
      },
      set(val) {
        this.$store.commit(POST_FIELD_TAGS, val);
      }
    }
  },
  methods: {
    handleChangeFeaturedImg(e) {
      const reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = event => {
        this.$store.commit(POST_FIELD_FEATURED_IMAGE, {
          src: event.target.result,
          dataUri: true
        });
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
