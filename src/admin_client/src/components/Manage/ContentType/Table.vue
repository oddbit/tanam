<template>
  <v-data-table
    :headers="headers"
    :items="items"
    hide-actions
    class="elevation-1"
  >
    <template slot="items" slot-scope="props">
      <td class="text-xs-center">{{ props.item.meta.key }}</td>
      <td class="text-xs-center">{{ props.item.meta.name }}</td>
      <td class="text-xs-center"><v-icon>{{ props.item.meta.icon }}</v-icon></td>
      <td class="text-xs-center">
        <span v-for="(field, i) in props.item.fields" :key="i">{{ field.name | fieldComma(i) }}</span>
      </td>
      <td class="justify-center layout px-0">
        <v-icon
          small
          class="mr-2"
          @click="$emit('editContentType', props.item)"
        >
          edit
        </v-icon>
        <v-icon
          small
          @click="$emit('deleteContentType', props.item)"
        >
          delete
        </v-icon>
      </td>
    </template>
    <template slot="no-data">
      <h3 class="text-xs-center">No Content Type</h3>
    </template>
  </v-data-table>
</template>

<script>
export default {
  props: {
    headers: {
      type: Array,
      default: () => []
    },
    items: {
      type: Array,
      default: () => []
    }
  },
  filters: {
    fieldComma(val, index) {
      if (index > 0) {
        return `, ${val}`;
      } else {
        return val;
      }
    }
  }
};
</script>
