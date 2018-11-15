<template>
  <HeaderSection :title="ctKey | toText">
    <template slot="actions">
      <v-btn :to="{ name: 'postNew', params:{ctKey: ctKey} }" color="primary">
      <v-icon left>create</v-icon>Add New {{ ctKey | toText }}</v-btn>
    </template>
  </HeaderSection>
</template>

<script>
import HeaderSection from '@/components/Shared/HeaderSection';
export default {
  filters: {
    toText(val) {
      return val.replace(/([a-zA-Z])(?=[A-Z])/g, '$1 ');
    }
  },
  components: {
    HeaderSection
  },
  props: {
    ctKey: {
      type: String,
      default: 'key'
    }
  }
};
</script>
