<template>
  <div>
    <div v-if="editMode" class="pa-3">
      <v-switch
        :label="postStatus ? 'Published' : 'Unpublished'"
        v-model="postStatus"
        hide-details
        color="primary"
      />
    </div>
    <v-list>
      <DrawerSettings>
        <template slot="title">URL Path</template>
        <v-text-field
          v-model="postPermalink"
          hint="e.g. / or /about or /contact"
          persistent-hint />
      </DrawerSettings>
    </v-list>
  </div>
</template>

<script>
import {
  POST_FIELD_FEATURED_IMAGE,
  POST_FIELD_TEMPLATE,
  POST_FIELD_TAGS,
  POST_FIELD_STATUS,
  POST_FIELD_PERMALINK
} from '@/store/types';
import FeaturedImageField from '@/components/Post/FeaturedImageField';
import DrawerSettings from '@/components/Shared/DrawerSettings';

export default {
  components: {
    FeaturedImageField,
    DrawerSettings
  },
  computed: {
    editMode() {
      return this.$store.state.layout.postMode !== 'new';
    },
    postState() {
      return this.$store.state.singlePost;
    },
    postStatus: {
      get() {
        return this.postState.status;
      },
      set(val) {
        this.$store.commit(POST_FIELD_STATUS, val);
      }
    },
    postFeaturedImage() {
      return this.$store.getters[POST_FIELD_FEATURED_IMAGE];
    },
    postPermalink: {
      get() {
        return this.$store.getters[POST_FIELD_PERMALINK];
      },
      set(val) {
        this.$store.commit(POST_FIELD_PERMALINK, val);
      }
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
      this.$store.commit(POST_FIELD_FEATURED_IMAGE, {
        src: null,
        dataUri: false
      });
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
