<template>
  <v-container>
    <header-section title="Page" description="Create and modify your own pages">
      <template slot="actions">
        <page-dialog page-title="Create Page" page-type="new">
          <template slot="openBtn">
            <v-btn color="primary" class="ma-0"><v-icon left>create</v-icon>Add New Page</v-btn>
          </template>
        </page-dialog>
      </template>
    </header-section>

    <page-table />
  </v-container>
</template>

<script>
import HeaderSection from '@/components/Shared/HeaderSection';
import PageDialog from '@/components/Page/Dialog';
import PageTable from '@/components/Page/Table';

export default {
  components: {
    HeaderSection,
    PageDialog,
    PageTable
  }
};
</script>
