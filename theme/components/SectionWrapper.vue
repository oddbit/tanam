<template>
  <section id="wrapper">
    <section 
      v-for="(section, index) in sections" 
      :key="section.id" 
      :id="section.id" 
      :class="`wrapper spotlight style${index + 1} ${index == 1 ? 'alt' : ''}`">
      <div class="inner">
        <a 
          href="#" 
          class="image">
          <img 
            :src="require(`~/assets/images/pic0${index + 1}.jpg`)" 
            alt="" ></a>
        <div class="content">
          <h2 class="major">{{ section.major }}</h2>
          <p>Lorem ipsum dolor sit amet, etiam lorem adipiscing elit. Cras turpis ante, nullam sit amet turpis non, sollicitudin posuere urna. Mauris id tellus arcu. Nunc vehicula id nulla dignissim dapibus. Nullam ultrices, neque et faucibus viverra, ex nulla cursus.</p>
          <a 
            href="#" 
            class="special">Learn more</a>
        </div>
      </div>
    </section>
    <!-- Four -->
    <section 
      id="four" 
      class="wrapper alt style1">
      <div class="inner">
        <h2 class="major">Vitae phasellus</h2>
        <p>Cras mattis ante fermentum, malesuada neque vitae, eleifend erat. Phasellus non pulvinar erat. Fusce tincidunt, nisl eget mattis egestas, purus ipsum consequat orci, sit amet lobortis lorem lacus in tellus. Sed ac elementum arcu. Quisque placerat auctor laoreet.</p>
        <section class="features">
          <article 
            v-for="(feature, index) in features" 
            :key="`feature-${index}`">
            <a 
              href="#" 
              class="image">
              <img 
                :src="require(`~/assets/images/pic0${index + 4}.jpg`)" 
                alt="" ></a>
            <h3 class="major">{{ feature }}</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing vehicula id nulla dignissim dapibus ultrices.</p>
            <a 
              href="#" 
              class="special">Learn more</a>
          </article>
        </section>
        <ul class="actions">
          <li><a 
            href="#" 
            class="button">Browse All</a></li>
        </ul>
      </div>
    </section>

  </section>
</template>

<script>
export default {
  data: () => ({
    sections: [
      {
        id: 'one',
        major: 'Magna arcu feugiat'
      },
      {
        id: 'two',
        major: 'Tempus adipiscing'
      },
      {
        id: 'three',
        major: 'Nullam dignissim'
      }
    ],
    features: [
      'Ante fermentum',
      'Fusce consequat',
      'Nisl placerat',
      'Sed feugiat lorem'
    ]
  })
};
</script>
