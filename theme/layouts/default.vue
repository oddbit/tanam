<template>
  <div id="page-wrapper">
    <header 
      id="header" 
    >
      <h1>
        <nuxt-link to="/">Tanam Theme</nuxt-link>
      </h1>
      <nav>
        <a href="#menu">Menu</a>
      </nav>
    </header>
    <nav id="menu">
      <div class="inner">
        <h2>Menu</h2>
        <ul class="links">
          <li><nuxt-link to="/">Home</nuxt-link></li>
          <li><nuxt-link to="/events">Events</nuxt-link></li>
        </ul>
        <a 
          href="#" 
          class="close">Close</a>
      </div>
    </nav>
    <nuxt/>
    <section id="footer">
      <div class="inner">
        <h2 class="major">Get in touch</h2>
        <p>Cras mattis ante fermentum, malesuada neque vitae, eleifend erat. Phasellus non pulvinar erat. Fusce tincidunt, nisl eget mattis egestas, purus ipsum consequat orci, sit amet lobortis lorem lacus in tellus. Sed ac elementum arcu. Quisque placerat auctor laoreet.</p>
        <form 
          method="post" 
          action="#">
          <div class="fields">
            <div class="field">
              <label for="name">Name</label>
              <input 
                id="name" 
                type="text" 
                name="name" >
            </div>
            <div class="field">
              <label for="email">Email</label>
              <input 
                id="email" 
                type="email" 
                name="email" >
            </div>
            <div class="field">
              <label for="message">Message</label>
              <textarea 
                id="message" 
                name="message" 
                rows="4"/>
            </div>
          </div>
          <ul class="actions">
            <li><input 
              type="submit" 
              value="Send Message" ></li>
          </ul>
        </form>
        <ul class="contact">
          <li class="fa-home">
            Untitled Inc<br >
            1234 Somewhere Road Suite #2894<br >
            Nashville, TN 00000-0000
          </li>
          <li class="fa-phone">(000) 000-0000</li>
          <li class="fa-envelope"><a href="#">information@untitled.tld</a></li>
          <li class="fa-twitter"><a href="#">twitter.com/untitled-tld</a></li>
          <li class="fa-facebook"><a href="#">facebook.com/untitled-tld</a></li>
          <li class="fa-instagram"><a href="#">instagram.com/untitled-tld</a></li>
        </ul>
        <ul class="copyright">
          <li>&copy; Untitled Inc. All rights reserved.</li><li>Design: <a href="http://html5up.net">HTML5 UP</a></li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script>
import $ from 'jquery';

export default {
  head: {
    bodyAttrs: {
      class: 'is-preload'
    }
  },
  mounted() {
    const $window = $(window),
      $body = $('body');

    $window.on('load', function() {
      window.setTimeout(function() {
        $body.removeClass('is-preload');
      }, 100);
    });

    const $menu = $('#menu');
    $menu._locked = false;

    $menu._lock = function() {
      if ($menu._locked) return false;

      $menu._locked = true;

      window.setTimeout(function() {
        $menu._locked = false;
      }, 350);

      return true;
    };

    $menu._show = function() {
      if ($menu._lock()) $body.addClass('is-menu-visible');
    };

    $menu._hide = function() {
      if ($menu._lock()) $body.removeClass('is-menu-visible');
    };

    $menu._toggle = function() {
      if ($menu._lock()) $body.toggleClass('is-menu-visible');
    };

    $menu
      .appendTo($body)
      .on('click', function(event) {
        event.stopPropagation();

        $menu._hide();
      })
      .find('.inner')
      .on('click', '.close', function(event) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();

        $menu._hide();
      })
      .on('click', function(event) {
        event.stopPropagation();
      })
      .on('click', 'a', function(event) {
        var href = $(this).attr('href');

        event.preventDefault();
        event.stopPropagation();

        $menu._hide();
      });

    $body
      .on('click', 'a[href="#menu"]', function(event) {
        event.stopPropagation();
        event.preventDefault();

        $menu._toggle();
      })
      .on('keydown', function(event) {
        if (event.keyCode == 27) $menu._hide();
      });
  }
};
</script>
