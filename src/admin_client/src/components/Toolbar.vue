<template>
  <v-toolbar 
    app 
    fixed 
    clipped-left 
    color="light-green darken-4" 
    dark>
    <v-toolbar-title><router-link to="/" class="toolbar-title">TANAM</router-link></v-toolbar-title>
    <v-spacer />
    <v-btn light>
      <v-icon left>create</v-icon>
      <span>Write</span>
    </v-btn>
    <v-btn icon>
      <v-icon>notifications</v-icon>
    </v-btn>
    <v-btn icon to="/profile">
      <v-icon>person</v-icon>
    </v-btn>
  </v-toolbar>
</template>

<style scoped>
.toolbar-title {
  color: #fff;
  text-decoration: none;
  font-weight: 600;
}
</style>
