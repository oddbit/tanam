<template>
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
          <v-list-tile-title>Place</v-list-tile-title>
        </v-list-tile>
        <div class="px-3">
          <v-text-field placeholder="Place" v-model="postPlace" />
        </div>
      </v-list-group>
      <v-list-group>
        <v-list-tile slot="activator">
          <v-list-tile-title>Date</v-list-tile-title>
        </v-list-tile>
        <div class="px-3">
          <v-dialog
            ref="startAt"
            lazy
            persistent
            full-width
            width="290"
            content-class="ma-0"
            v-model="dialogStartDate"
            :return-value.sync="postDateStart"
          >
            <v-text-field
              slot="activator"
              v-model="postDateStart"
              label="Start At"
              prepend-icon="event"
              readonly
            />
            <v-date-picker v-model="postDateStart">
              <v-spacer />
              <v-btn flat color="primary" @click="dialogStartDate = false">Cancel</v-btn>
              <v-btn flat color="primary" @click="$refs.startAt.save(postDateStart)">OK</v-btn>
            </v-date-picker>
          </v-dialog>
          <v-dialog
            ref="endAt"
            lazy
            persistent
            width="290"
            content-class="ma-0"
            full-width
            v-model="dialogEndDate"
            :return-value.sync="postDateEnd"
          >
            <v-text-field
              slot="activator"
              v-model="postDateEnd"
              label="End At"
              prepend-icon="event"
              readonly
            />
            <v-date-picker v-model="postDateEnd">
              <v-spacer />
              <v-btn flat color="primary" @click="dialogEndDate = false">Cancel</v-btn>
              <v-btn flat color="primary" @click="$refs.endAt.save(postDateEnd)">OK</v-btn>
            </v-date-picker>
          </v-dialog>
        </div>
      </v-list-group>
      <v-list-group>
        <v-list-tile slot="activator">
          <v-list-tile-title>Price</v-list-tile-title>
        </v-list-tile>
        <div class="px-3">
          <v-text-field 
            label="Regular" 
            prefix="Rp" 
            placeholder="0" 
            v-model="postPriceRegular" />
          <v-text-field 
            label="Member" 
            prefix="Rp" 
            placeholder="0" 
            v-model="postPriceMember" />
        </div>
      </v-list-group>
      <v-list-group>
        <v-list-tile slot="activator">
          <v-list-tile-title>RSVP</v-list-tile-title>
        </v-list-tile>
        <div class="px-3">
          <v-text-field label="Email" v-model="postRsvpEmail" />
          <v-text-field label="Url" v-model="postRsvpUrl" />
          <v-text-field label="Facebook" v-model="postRsvpFacebook" />
        </div>
      </v-list-group>
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
</template>

<script>
import {
  POST_PLACE,
  POST_DATE_START,
  POST_DATE_END,
  POST_PRICE_REGULAR,
  POST_PRICE_MEMBER,
  POST_RSVP_EMAIL,
  POST_RSVP_URL,
  POST_RSVP_FACEBOOK,
  POST_FEATURED_IMAGE,
  POST_PERMALINK,
  DELETE_POST,
  POST_ID
} from '@/store/types';

export default {
  data: () => ({
    dialogStartDate: false,
    dialogEndDate: false
  }),
  computed: {
    drawer() {
      return this.$store.state.drawer.statusEventPost;
    },
    postPlace: {
      get() {
        return this.$store.getters[POST_PLACE];
      },
      set(val) {
        this.$store.commit(POST_PLACE, val);
      }
    },
    postDateStart: {
      get() {
        return this.$store.getters[POST_DATE_START];
      },
      set(val) {
        this.$store.commit(POST_DATE_START, val);
      }
    },
    postDateEnd: {
      get() {
        return this.$store.getters[POST_DATE_END];
      },
      set(val) {
        this.$store.commit(POST_DATE_END, val);
      }
    },
    postPriceRegular: {
      get() {
        return this.$store.getters[POST_PRICE_REGULAR];
      },
      set(val) {
        this.$store.commit(POST_PRICE_REGULAR, val);
      }
    },
    postPriceMember: {
      get() {
        return this.$store.getters[POST_PRICE_MEMBER];
      },
      set(val) {
        this.$store.commit(POST_PRICE_MEMBER, val);
      }
    },
    postRsvpEmail: {
      get() {
        return this.$store.getters[POST_RSVP_EMAIL];
      },
      set(val) {
        this.$store.commit(POST_RSVP_EMAIL, val);
      }
    },
    postRsvpUrl: {
      get() {
        return this.$store.getters[POST_RSVP_URL];
      },
      set(val) {
        this.$store.commit(POST_RSVP_URL, val);
      }
    },
    postRsvpFacebook: {
      get() {
        return this.$store.getters[POST_RSVP_FACEBOOK];
      },
      set(val) {
        this.$store.commit(POST_RSVP_FACEBOOK, val);
      }
    },
    postFeaturedImage() {
      return this.$store.getters[POST_FEATURED_IMAGE];
    },
    postPermalink() {
      return this.$store.getters[POST_PERMALINK];
    }
  },
  methods: {
    handleChangeFeaturedImg(e) {
      const reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = event => {
        this.$store.commit(POST_FEATURED_IMAGE, event.target.result);
      };
    },
    handleCloseFeaturedImg() {
      this.$store.commit(POST_FEATURED_IMAGE, null);
      this.$refs.featuredImg.value = null;
    },
    handleInputDrawer(val) {
      this.$store.commit('drawer/toggleDrawerEventPost', val);
    },
    handleClickDelete() {
      this.$store
        .dispatch(DELETE_POST, this.$store.getters[POST_ID])
        .then(() => this.$router.push('/events'));
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
