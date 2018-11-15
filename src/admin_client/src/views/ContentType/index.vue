<template>
  <v-container>
    <post-index :ct-key="ctKey" />
    <HeaderSection :title="ctKey | toText">
      <template slot="actions">
        <v-btn :to="{ name: 'postNew', params:{ctkey: ctkey} }" color="primary">
        <v-icon left>create</v-icon>New Post</v-btn>
      </template>
    </HeaderSection>
    <v-card>
      <v-card-actions>
        <v-layout row>
          <v-flex xs2 mr-4>
            <v-select
              :items="['Published', 'Unpublished']"
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
              @click="openDeleteDialog(props.item)">
              delete
            </v-icon>
          </td>
        </template>
        Your search for "{{ search }}" found no results.
      </v-data-table>
    </v-card>
    <!-- Dialog Delete -->
    <v-dialog
      v-model="dialogDelete"
      max-width="290">
      <v-card>
        <v-card-title class="title">
          Warning!
        </v-card-title>
        <v-card-text>
          This process will delete post permanently<br>
          Delete "{{ tmpData.data.title }}" ?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="green darken-1"
            flat="flat"
            @click="dialogDelete = false">
            Cancel
          </v-btn>
          <v-btn
            color="red darken-1"
            flat="flat"
            @click="deletePost">
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- End Dialog Delete -->
  </v-container>
</template>

<script>
import dateFormat from 'date-fns/format';
import PostIndex from '@/components/Post/PostIndex';
import PostList from '@/components/Post/PostList';
import HeaderSection from '@/components/Shared/HeaderSection';
import { POST_PUBLISHED, POST_UNPUBLISHED, POST_DELETED } from '@/store/types';

export default {
  components: {
    PostIndex,
    PostList,
    HeaderSection
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
    dialogDelete: false,
    tmpData: {
      data: {
        title: ''
      }
    },
    status: 'Published',
    headers: [
      { text: 'ID', value: 'key', sortable: false },
      { text: 'Title Post', value: 'data.title' },
      { text: 'Date', value: 'updateTime' },
      { text: 'Actions', sortable: false, width: '50px' }
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
      if (this.status == 'Published') {
        return this.published;
      } else {
        return this.unpublished;
      }
    }
  },
  watch: {
    ctKey() {
      this.status = 'Published';
      this.$store.dispatch(POST_PUBLISHED, this.ctKey);
      this.$store.dispatch(POST_UNPUBLISHED, this.ctKey);
    }
  },
  mounted() {
    this.$store.dispatch(POST_PUBLISHED, this.ctKey);
    this.$store.dispatch(POST_UNPUBLISHED, this.ctKey);
  },
  methods: {
    deletePost() {
      this.$store.dispatch(POST_DELETED, {
        postId: this.tmpData.key,
        ctKey: this.ctKey
      });
      this.dialogDelete = false;
    },
    openDeleteDialog(item) {
      this.dialogDelete = true;
      this.tmpData = item;
    },
    editItem(item) {
      this.$router.push({
        name: 'postEdit',
        params: { ctKey: this.ctKey, postID: item.key }
      });
    }
  }
};
</script>
