<template>
  <div class="wrapper">
    <v-layout>
      <v-layout column align-start justify-center>
        <!-- <router-link :to="`${pushLink}/${linkTo}`"><h3><slot name="title" /></h3></router-link> -->
        <router-link to="#"><h3>{{ contentTitle }}</h3></router-link>
        <p class="mb-0">{{ time | formatDate }}</p>
      </v-layout>
      <v-spacer />
      <v-menu offset-y left min-width="150">
        <v-btn slot="activator" icon class="btn-more">
          <v-icon>more_vert</v-icon>
        </v-btn>
        <v-list>
          <div v-if="status == 'unpublished'">
            <v-list-tile 
              v-for="item in listActionUnpublished"
              :key="item.name"
              ripple
              @click="handleClickActionItem(item.name)">
              <v-icon class="action-icon">{{ item.icon }}</v-icon>
              <v-list-tile-title>{{ item.text }}</v-list-tile-title>
            </v-list-tile>
          </div>
          <div v-if="status == 'published'">
            <v-list-tile 
              v-for="item in listAction"
              :key="item.name"
              ripple
              @click="handleClickActionItem(item.name)">
              <v-icon class="action-icon">{{ item.icon }}</v-icon>
              <v-list-tile-title>{{ item.text }}</v-list-tile-title>
            </v-list-tile>
          </div>
        </v-list>
      </v-menu>
    </v-layout>
  </div>
</template>

<script>
import dateFormat from 'date-fns/format';

export default {
  filters: {
    formatDate(timestamp) {
      return dateFormat(timestamp.toDate(), 'MMMM DD, YYYY - HH:mm');
    }
  },
  props: {
    contentTitle: {
      type: String,
      default: 'Title'
    },
    time: {
      type: Object,
      default: () => {}
    },
    status: {
      type: String,
      default: 'unpublished'
    }
  },
  data: () => ({
    listAction: [
      { name: 'edit', text: 'Edit', icon: 'edit' },
      { name: 'delete', text: 'Delete', icon: 'delete' }
    ],
    listActionUnpublished: [
      { name: 'edit', text: 'Edit', icon: 'edit' },
      { name: 'publish', text: 'Publish', icon: 'publish' },
      { name: 'delete', text: 'Delete', icon: 'delete' }
    ]
  })
};
</script>


<style lang="scss" scoped>
.wrapper {
  background: #fff;
  padding: 16px 0 16px 16px;

  .img-wrapper {
    width: 60px;
    height: 60px;

    img {
      max-width: 100%;
      object-fit: cover;
    }
  }

  a {
    text-decoration: none;
    text-align: left;

    :hover {
      color: #555;
    }
  }

  h3 {
    color: #333;
  }

  p {
    color: #777;
  }
}

.action-icon {
  margin-right: 8px;
}
</style>
