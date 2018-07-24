<template>
  <div>
    <section id="banner">
      <div class="inner">
        <div class="logo"><span class="icon fa-diamond"/></div>
        <h2>This is Solid State</h2>
        <p>Another free + fully responsive site template by <a href="http://html5up.net">HTML5 UP</a></p>
      </div>
    </section>
    <SectionWrapper/>
  </div>
</template>

<script>
import SectionWrapper from '~/components/SectionWrapper';

export default {
  components: {
    SectionWrapper
  }
};
</script>
