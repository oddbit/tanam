<template>
  <v-container>
    <v-card>
      <v-card-actions>
        <v-layout row>
          <v-flex xs2 mr-4>
            <v-select
              :items="['published', 'unpublished']"
              v-model="status"
              label="Status"
              single-line
              hide-details />
          </v-flex>
          <v-flex xs3>
            <v-text-field
              v-model="search"
              append-icon="search"
              label="Search"
              single-line
              hide-details
            />
          </v-flex>
        </v-layout>
      </v-card-actions>
      <v-data-table
        :headers="headers"
        :items="filteredItems"
        :search="search">
        <template slot="items" slot-scope="props">
          <td>{{ props.item.key }}</td>
          <td>{{ props.item.data.title }}</td>
          <td>{{ props.item.updateTime | formatDate }}</td>
          <td>
            <v-icon
              small
              class="mr-2"
              @click="editItem(props.item)">
              edit
            </v-icon>
            <v-icon
              small
              @click="deleteItem(props.item)">
              delete
            </v-icon>
          </td>
        </template>
        <v-alert 
          slot="no-results" 
          :value="true" 
          color="error" 
          icon="warning">
          Your search for "{{ search }}" found no results.
        </v-alert>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
import dateFormat from 'date-fns/format';
import PostIndex from '@/components/Post/PostIndex';
import PostList from '@/components/Post/PostList';
import { POST_PUBLISHED, POST_UNPUBLISHED } from '@/store/types';

export default {
  components: {
    PostIndex,
    PostList
  },
  filters: {
    formatDate(timestamp) {
      return dateFormat(timestamp.toDate(), 'MMMM DD, YYYY - HH:mm');
    },
    toText(val) {
      return val.replace(/([a-zA-Z])(?=[A-Z])/g, '$1 ').toUpperCase();
    }
  },
  props: {
    ctKey: {
      type: String,
      default: 'name'
    }
  },
  data: () => ({
    search: '',
    status: 'published',
    headers: [
      { text: 'ID', value: 'key', sortable: false },
      { text: 'Title Post', value: 'data.title' },
      { text: 'Date', value: 'updateTime' },
      { text: 'Actions', sortable: false }
    ]
  }),
  computed: {
    published() {
      return this.$store.getters[POST_PUBLISHED];
    },
    unpublished() {
      return this.$store.getters[POST_UNPUBLISHED];
    },
    filteredItems() {
      if (this.status == 'published') {
        return this.published;
      } else {
        return this.unpublished;
      }
    }
  },
  watch: {
    ctKey() {
      this.status = 'published';
      this.$store.dispatch(POST_PUBLISHED, this.ctKey);
      this.$store.dispatch(POST_UNPUBLISHED, this.ctKey);
    }
  },
  mounted() {
    this.$store.dispatch(POST_PUBLISHED, this.ctKey);
    this.$store.dispatch(POST_UNPUBLISHED, this.ctKey);
  }
};
</script>
