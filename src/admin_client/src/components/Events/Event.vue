<template>
  <div class="wrapper">
    <v-layout>
      <v-layout column align-start justify-center>
        <router-link :to="`/events/post/${linkTo}`"><h3><slot name="title" /></h3></router-link>
        <p class="mb-0"><slot name="datetime" /></p>
      </v-layout>
      <v-spacer />
      <v-menu offset-y left min-width="150">
        <v-btn slot="activator" icon class="btn-more">
          <v-icon>more_vert</v-icon>
        </v-btn>
        <v-list><slot name="action-menu-item" /></v-list>
      </v-menu>
    </v-layout>
  </div>
</template>

<script>
export default {
  props: {
    linkTo: {
      type: String,
      default: ''
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
