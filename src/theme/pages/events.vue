<template>
  <section id="wrapper">
    <header>
      <div class="inner">
        <h2>Events</h2>
        <p>Phasellus non pulvinar erat. Fusce tincidunt nisl eget ipsum.</p>
      </div>
    </header>

    <!-- Content -->
    <div class="wrapper">
      <div class="inner">

        <section class="features">
          <article
            v-for="post in blogPosts"
            :key="post.permalink">
            <a
              href="#"
              class="image"><img
                :src="post.featuredImage"
                alt="" ></a>
            <h3 class="major">{{ post.title }}</h3>
            <a
              href="#"
              class="special">Learn more</a>
          </article>
        </section>

      </div>
    </div>

  </section>
</template>

<script>
export default {
  async fetch({ store }) {
    await store.dispatch('event/fetchEventPosts');
  },
  computed: {
    blogPosts() {
      return this.$store.getters['event/getEventPosts'];
    }
  }
};
</script>
