<template>
  <section id="wrapper">
    <header>
      <div class="inner">
        <h2>Blogs</h2>
        <p>Blog posts goes here...</p>
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
    await store.dispatch('blog/fetchBlogPosts');
  },
  computed: {
    blogPosts() {
      return this.$store.getters['blog/getBlogPosts'];
    }
  }
};
</script>
