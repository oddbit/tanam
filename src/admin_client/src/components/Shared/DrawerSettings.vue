<template>
  <v-list-group>
    <v-list-tile slot="activator">
      <v-list-tile-title>
        <slot name="title" />
      </v-list-tile-title>
    </v-list-tile>
    <div class="pa-3">
      <slot />
    </div>
  </v-list-group>
</template>
