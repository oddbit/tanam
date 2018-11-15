<template>
  <v-dialog v-model="dialog" max-width="550">
    <slot slot="activator" name="openBtn" />
    <v-card class="pa-4 card-wrapper">
      <v-layout align-center justify-space-between class="mb-5">
        <h2 class="title">{{ pageTitle }}</h2>
        <div>
          <v-btn 
            :disabled="isSubmitting" 
            small 
            outline 
            color="primary" 
            @click="dialog = false">Cancel</v-btn>
          <v-btn 
            :loading="isSubmitting" 
            :disabled="!formValid"
            small 
            color="primary" 
            @click="submit">Save</v-btn>
        </div>
      </v-layout>
      <v-form ref="form" v-model="formValid" lazy-validation>
        <v-text-field 
          v-model="title" 
          :rules="[v => !!v || 'Title is required']" 
          label="Title"
          required
          placeholder="e.g. Blog" 
          class="margin-field" />
        <v-textarea
          v-model="description" 
          class="margin-field" 
          label="Description" 
          auto-grow
          rows="1"
          placeholder="e.g. Blog page contains all the blog post" />
        <v-text-field 
          v-model="templateName" 
          :rules="[v => !!v || 'Template name is required']"
          required
          class="margin-field"
          label="Template Name" 
          placeholder="e.g. blog"
          hint="Template name refer to DustJS view name" 
          persistent-hint />
        <v-text-field 
          v-model="pathName" 
          class="margin-field"
          label="Path Name" 
          placeholder="e.g. /blogs"
          hint="Path to access the page and can be different with template name. Ensure to include '/'" 
          persistent-hint />
        <v-switch
          v-model="status"
          :label="`Status: ${status === 'published' ? 'Publish' : 'Unpublish'}`"
          true-value="published"
          false-value="unpublished"
          color="primary"
        />
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import { PAGE_SAVE } from '@/store/types';

export default {
  props: {
    pageTitle: {
      type: String,
      default: 'Create Page'
    },
    pageType: {
      type: String,
      default: 'new'
    },
    item: {
      type: Object,
      default: () => ({})
    }
  },
  data: () => ({
    formValid: true,
    dialog: false,
    isSubmitting: false,
    title: '',
    description: '',
    templateName: '',
    pathName: '',
    status: 'published'
  }),
  watch: {
    dialog(val) {
      if (!val) {
        this.clear();
      } else {
        if (this.pageType === 'edit' && Object.keys(this.item).length > 0) {
          this.title = this.item.data.title;
          this.description = this.item.data.description;
          this.templateName = this.item.template;
          this.pathName = this.item.permalink;
          this.status = this.item.status;
        }
      }
    }
  },
  methods: {
    submit() {
      this.pageType === 'edit' ? this.editPage() : this.createPage();
    },
    async createPage() {
      this.isSubmitting = true;
      if (this.$refs.form.validate()) {
        try {
          await this.$store.dispatch(PAGE_SAVE, {
            title: this.title,
            description: this.description,
            templateName: this.templateName,
            pathName: this.pathName,
            status: this.status
          });
          this.dialog = false;
          this.clear();
        } catch (error) {
          this.isSubmitting = false;
        }
      } else {
        this.isSubmitting = false;
      }
    },
    async editPage() {
      this.isSubmitting = true;
      if (this.$refs.form.validate()) {
        try {
          await this.$store.dispatch(PAGE_SAVE, {
            title: this.title,
            description: this.description,
            templateName: this.templateName,
            pathName: this.pathName,
            status: this.status,
            isEditedMode: this.pageType === 'edit',
            id: this.item.key
          });
          this.dialog = false;
          this.clear();
        } catch (error) {
          this.isSubmitting = false;
        }
      } else {
        this.isSubmitting = false;
      }
    },
    clear() {
      this.$refs.form.reset();
      this.isSubmitting = false;
      setTimeout(() => (this.status = 'published'), 300);
    }
  }
};
</script>

<style lang="scss" scoped>
.title {
  color: #333;
}

.card-wrapper {
  display: flex;
  flex-direction: column;
}

.margin-field {
  margin-top: 8px;
  margin-bottom: 8px;
}
</style>
