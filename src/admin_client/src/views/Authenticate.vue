<template>
  <h1 class="text-xs-center">Please Wait</h1>
</template>

<script>
import { CURRENT_USER } from '@/store/types';

export default {
  computed: {
    currentUser() {
      return this.$store.getters[CURRENT_USER];
    }
  },
  watch: {
    currentUser(user) {
      if (user.isOwner) {
        // this.$router.push('/');
      }
    }
  }
};
</script>
