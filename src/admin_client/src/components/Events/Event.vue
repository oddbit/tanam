<template>
  <div class="wrapper">
    <v-layout>
      <v-layout column align-start justify-center>
        <router-link to="/events/post/slug"><h3>Lorem ipsum dolor sit amet this is the title</h3></router-link>
        <p class="mb-0">Jun 18, 2018 - 5:00 PM</p>
      </v-layout>
      <v-spacer />
      <v-menu offset-y left min-width="150">
        <v-btn slot="activator" icon class="btn-more">
          <v-icon>more_vert</v-icon>
        </v-btn>
        <v-list v-if="id === 'published'">
          <PublishedActionMenuItem />
        </v-list>
        <v-list v-else>
          <DraftActionMenuItem />
        </v-list>
      </v-menu>
    </v-layout>
  </div>
</template>

<script>
export default {
  components: {
    PublishedActionMenuItem: () =>
      import('@/components/Events/PublishedActionMenuItem'),
    DraftActionMenuItem: () => import('@/components/Events/DraftActionMenuItem')
  },
  props: {
    id: {
      type: String,
      default: 'published'
    }
  },
  data: () => ({
    listAction: [
      { name: 'edit', text: 'Edit', icon: 'edit' },
      { name: 'view', text: 'View', icon: 'visibility' },
      { name: 'share', text: 'Share', icon: 'share' },
      { name: 'delete', text: 'Delete', icon: 'delete' }
    ]
  }),
  methods: {
    handleClickActionItem() {
      return null;
    }
  }
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
