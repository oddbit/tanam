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
          <v-list-tile-title>Title</v-list-tile-title>
        </v-list-tile>
        <div class="px-3">
          <v-text-field placeholder="Title" v-model="title" />
        </div>
      </v-list-group>
      <v-list-group>
        <v-list-tile slot="activator">
          <v-list-tile-title>Place</v-list-tile-title>
        </v-list-tile>
        <div class="px-3">
          <v-text-field placeholder="Place" v-model="place" />
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
            :return-value.sync="dateStart"
          >
            <v-text-field
              slot="activator"
              v-model="dateStart"
              label="Start At"
              prepend-icon="event"
              readonly
            />
            <v-date-picker v-model="dateStart">
              <v-spacer />
              <v-btn flat color="primary" @click="dialogStartDate = false">Cancel</v-btn>
              <v-btn flat color="primary" @click="$refs.startAt.save(dateStart)">OK</v-btn>
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
            :return-value.sync="dateEnd"
          >
            <v-text-field
              slot="activator"
              v-model="dateEnd"
              label="End At"
              prepend-icon="event"
              readonly
            />
            <v-date-picker v-model="dateEnd">
              <v-spacer />
              <v-btn flat color="primary" @click="dialogEndDate = false">Cancel</v-btn>
              <v-btn flat color="primary" @click="$refs.endAt.save(dateEnd)">OK</v-btn>
            </v-date-picker>
          </v-dialog>
        </div>
      </v-list-group>
      <v-list-group>
        <v-list-tile slot="activator">
          <v-list-tile-title>Price</v-list-tile-title>
        </v-list-tile>
        <div class="px-3">
          <v-text-field label="Reguler" prefix="Rp" v-model="priceReguler" />
          <v-text-field label="Member" prefix="Rp" v-model="priceMember" />
        </div>
      </v-list-group>
      <v-list-group>
        <v-list-tile slot="activator">
          <v-list-tile-title>RSVP</v-list-tile-title>
        </v-list-tile>
        <div class="px-3">
          <v-text-field label="Email" v-model="rsvpEmail" />
          <v-text-field label="Url" v-model="rsvpUrl" />
          <v-text-field label="Facebook" v-model="rsvpFacebook" />
        </div>
      </v-list-group>
      <v-list-group>
        <v-list-tile slot="activator">
          <v-list-tile-title>Featured Image</v-list-tile-title>
        </v-list-tile>
        <div class="px-3">
          <div class="featured-img-wrapper">
            <v-btn class="btn-set" @click="$refs.featuredImg.click()">Set Featured Image</v-btn>
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
          <v-text-field readonly disabled :value="permalink" />
        </div>
      </v-list-group>
    </v-list>
    <div class="delete-wrapper">
      <v-divider />
      <v-btn flat class="ma-0" block><v-icon left>delete</v-icon>Delete</v-btn>
    </div>
  </v-navigation-drawer>
</template>

<script>
export default {
  data: () => ({
    dialogStartDate: false,
    dialogEndDate: false,
    title: null,
    place: null,
    dateStart: null,
    dateEnd: null,
    priceReguler: 0,
    priceMember: 0,
    rsvpEmail: null,
    rsvpUrl: null,
    rsvpFacebook: null,
    permalink: 'https://localhost'
  }),
  computed: {
    drawer() {
      return this.$store.state.drawer.statusEventPost;
    }
  },
  methods: {
    handleChangeFeaturedImg(e) {
      console.log(e.target.files);
    },
    handleInputDrawer(val) {
      this.$store.commit('drawer/toggleDrawerEventPost', val);
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
}

.delete-wrapper {
  margin-top: auto;

  .btn {
    height: 48px !important;
  }
}
</style>
