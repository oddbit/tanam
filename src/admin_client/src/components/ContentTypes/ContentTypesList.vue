<template>
  <div class="wrapper">
    <v-layout>
      <v-layout column align-start justify-center>
        <!-- <router-link :to="`${pushLink}/${linkTo}`"><h3><slot name="title" /></h3></router-link> -->
        <router-link to="#"><h3>{{ContentTitle}}</h3></router-link>
        <p class="mb-0">{{updateTime | formatDate}}</p>
      </v-layout>
      <v-spacer />
      <v-menu offset-y left min-width="150">
        <v-btn slot="activator" icon class="btn-more">
          <v-icon>more_vert</v-icon>
        </v-btn>
        <v-list>
          <v-list-tile 
            v-for="item in listAction" 
            :key="item.name"
            @click="handleClickActionItem(item.name)"
            ripple>
            <v-icon class="action-icon">{{ item.icon }}</v-icon>
            <v-list-tile-title>{{ item.text }}</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-layout>
  </div>
</template>

<script>
export default {
  props: [
    'ContentTitle',
    'time',
    'status'
  ],
  filters: {
    formatDate(timestamp) {
      return formatDate(timestamp.toDate());
    }
  },
  data: () => ({
    listAction: [
      { name: 'edit', text: 'Edit', icon: 'edit' },
      { name: 'publish', text: 'Publish', icon: 'publish' },
      { name: 'delete', text: 'Delete', icon: 'delete' }
    ]
  })
}
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
