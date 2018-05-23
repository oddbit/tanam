<template>
  <v-container>
    <v-layout
      justify-center
      class="py-4 layout">
      <v-flex
        xs12
        md8>
        <Profile />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import Profile from '@/components/Profile/Profile';

export default {
  components: {
    Profile
  }
};
</script>
