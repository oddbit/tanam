<template>
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
        <h4 class="datetime-title">START</h4>
        <div class="datetime-wrapper">
          <span class="date-wrapper">
            <v-dialog
              ref="dateStart"
              lazy
              persistent
              width="290"
              content-class="ma-0"
              v-model="dialogDateStart"
              :return-value.sync="postDateStart"
            >
              <v-text-field
                slot="activator"
                v-model="postDateStart"
                label="Date"
                readonly
              />
              <v-date-picker v-model="postDateStart">
                <v-spacer />
                <v-btn flat color="primary" @click="dialogDateStart = false">Cancel</v-btn>
                <v-btn flat color="primary" @click="$refs.dateStart.save(postDateStart)">OK</v-btn>
              </v-date-picker>
            </v-dialog>
          </span>
          <span class="time-wrapper">
            <v-dialog
              ref="timeStart"
              v-model="dialogTimeStart"
              :return-value.sync="postTimeStart"
              persistent
              lazy
              width="290"
              content-class="ma-0"
            >
              <v-text-field
                slot="activator"
                v-model="postTimeStart"
                label="Time"
                readonly
              />
              <v-time-picker v-model="postTimeStart" actions>
                <v-spacer />
                <v-btn flat color="primary" @click="dialogTimeStart = false">Cancel</v-btn>
                <v-btn flat color="primary" @click="$refs.timeStart.save(postTimeStart)">OK</v-btn>
              </v-time-picker>
            </v-dialog>
          </span>
        </div>
        <h4 class="datetime-title">END</h4>
        <div class="datetime-wrapper">
          <span class="date-wrapper">
            <v-dialog
              ref="dateEnd"
              lazy
              persistent
              width="290"
              content-class="ma-0"
              v-model="dialogDateEnd"
              :return-value.sync="postDateEnd"
            >
              <v-text-field
                slot="activator"
                v-model="postDateEnd"
                label="Date"
                readonly
              />
              <v-date-picker v-model="postDateEnd">
                <v-spacer />
                <v-btn flat color="primary" @click="dialogDateEnd = false">Cancel</v-btn>
                <v-btn flat color="primary" @click="$refs.dateEnd.save(postDateEnd)">OK</v-btn>
              </v-date-picker>
            </v-dialog>
          </span>
          <span class="time-wrapper">
            <v-dialog
              ref="timeEnd"
              v-model="dialogTimeEnd"
              :return-value.sync="postTimeEnd"
              persistent
              lazy
              width="290"
              content-class="ma-0"
            >
              <v-text-field
                slot="activator"
                v-model="postTimeEnd"
                label="Time"
                readonly
              />
              <v-time-picker v-model="postTimeEnd" actions>
                <v-spacer />
                <v-btn flat color="primary" @click="dialogTimeEnd = false">Cancel</v-btn>
                <v-btn flat color="primary" @click="$refs.timeEnd.save(postTimeEnd)">OK</v-btn>
              </v-time-picker>
            </v-dialog>
          </span>
        </div>
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
import {
  POST_FIELD_PLACE,
  POST_FIELD_DATE_START,
  POST_FIELD_TIME_START,
  POST_FIELD_DATE_END,
  POST_FIELD_TIME_END,
  POST_FIELD_PRICE_REGULAR,
  POST_FIELD_PRICE_MEMBER,
  POST_FIELD_RSVP_EMAIL,
  POST_FIELD_RSVP_URL,
  POST_FIELD_RSVP_FACEBOOK,
  POST_FIELD_FEATURED_IMAGE,
  POST_FIELD_PERMALINK
} from '@/store/types';
import FeaturedImageField from '@/components/Post/FeaturedImageField';

export default {
  components: {
    FeaturedImageField
  },
  data: () => ({
    dialogDateStart: false,
    dialogTimeStart: false,
    dialogDateEnd: false,
    dialogTimeEnd: false
  }),
  computed: {
    postPlace: {
      get() {
        return this.$store.getters[POST_FIELD_PLACE];
      },
      set(val) {
        this.$store.commit(POST_FIELD_PLACE, val);
      }
    },
    postDateStart: {
      get() {
        return this.$store.getters[POST_FIELD_DATE_START];
      },
      set(val) {
        this.$store.commit(POST_FIELD_DATE_START, val);
      }
    },
    postTimeStart: {
      get() {
        return this.$store.getters[POST_FIELD_TIME_START];
      },
      set(val) {
        this.$store.commit(POST_FIELD_TIME_START, val);
      }
    },
    postDateEnd: {
      get() {
        return this.$store.getters[POST_FIELD_DATE_END];
      },
      set(val) {
        this.$store.commit(POST_FIELD_DATE_END, val);
      }
    },
    postTimeEnd: {
      get() {
        return this.$store.getters[POST_FIELD_TIME_END];
      },
      set(val) {
        this.$store.commit(POST_FIELD_TIME_END, val);
      }
    },
    postPriceRegular: {
      get() {
        return this.$store.getters[POST_FIELD_PRICE_REGULAR];
      },
      set(val) {
        this.$store.commit(POST_FIELD_PRICE_REGULAR, val);
      }
    },
    postPriceMember: {
      get() {
        return this.$store.getters[POST_FIELD_PRICE_MEMBER];
      },
      set(val) {
        this.$store.commit(POST_FIELD_PRICE_MEMBER, val);
      }
    },
    postRsvpEmail: {
      get() {
        return this.$store.getters[POST_FIELD_RSVP_EMAIL];
      },
      set(val) {
        this.$store.commit(POST_FIELD_RSVP_EMAIL, val);
      }
    },
    postRsvpUrl: {
      get() {
        return this.$store.getters[POST_FIELD_RSVP_URL];
      },
      set(val) {
        this.$store.commit(POST_FIELD_RSVP_URL, val);
      }
    },
    postRsvpFacebook: {
      get() {
        return this.$store.getters[POST_FIELD_RSVP_FACEBOOK];
      },
      set(val) {
        this.$store.commit(POST_FIELD_RSVP_FACEBOOK, val);
      }
    },
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
