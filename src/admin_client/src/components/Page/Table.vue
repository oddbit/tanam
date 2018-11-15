<template>
  <v-data-table
    :headers="headers"
    :items="pageFields"
    class="elevation-1 pageTable"
  >
    <template slot="items" slot-scope="props">
      <td>{{ props.item.key }}</td>
      <td>{{ props.item.status }}</td>
      <td>{{ props.item.data.title }}</td>
      <td>{{ props.item.data.description }}</td>
      <td>{{ props.item.template }}</td>
      <td>{{ props.item.permalink }}</td>
      <td class="text-xs-right">
        <v-btn 
          icon 
          flat 
          small 
          class="ma-0"><v-icon small color="#555">edit</v-icon></v-btn>
        <v-btn 
          icon 
          flat 
          small 
          class="ma-0"><v-icon small color="#555">delete</v-icon></v-btn>
      </td>
    </template>
  </v-data-table>
</template>

<script>
import { PAGE_FIELDS, PAGE_GET } from '@/store/types';

export default {
  data: () => ({
    headers: [
      {
        text: 'ID',
        sortable: false,
        value: 'key'
      },
      { text: 'Status', value: 'status' },
      { text: 'Title', value: 'data.title' },
      { text: 'Description', value: 'data.description', sortable: false },
      { text: 'Template', value: 'template' },
      { text: 'Permalink', value: 'permalink' },
      { text: '', value: '', align: 'right', sortable: false, width: '110px' }
    ]
  }),
  computed: {
    pageFields() {
      return this.$store.getters[PAGE_FIELDS];
    }
  },
  mounted() {
    this.$store.dispatch(PAGE_GET);
  }
};
</script>

<style lang="scss">
.pageTable {
  table {
    table-layout: fixed;

    td {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  }
}
</style>
