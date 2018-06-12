<template>
  <v-dialog 
    :value="dialog" 
    @input="handleInputDialog" 
    max-width="500px"
    lazy
    persistent>
    <v-card>
      <div class="img-wrapper">
        <vue-cropper
          ref='cropper'
          :view-mode="2"
          :src="image"
          :aspect-ratio="1/1"
          :background="false" />
      </div>
      <v-card-actions class="btn-action-wrapper">
        <v-btn color="primary" @click="handleClickSave">Save</v-btn>
        <v-btn @click="handleClickCancel">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import gravatar from '@/assets/images/gravatar.jpg';

export default {
  props: {
    image: {
      type: String,
      default: gravatar
    },
    dialog: {
      type: Boolean,
      default: false
    }
  },
  updated() {
    this.$refs.cropper.replace(this.image);
  },
  methods: {
    handleInputDialog(val) {
      if (!val) this.$emit('handleToggleDialog', val);
    },
    cropImage() {
      const imgResult = this.$refs.cropper.getCroppedCanvas().toDataURL();
      this.$emit('handleChangeCropAvatar', imgResult);
    },
    handleClickSave() {
      this.cropImage();
      this.handleInputDialog(false);
    },
    handleClickCancel() {
      this.handleInputDialog(false);
    }
  }
};
</script>

<style lang="scss" scoped>
.img-wrapper {
  overflow: hidden;
  img {
    max-width: 100%;
  }
}
.btn-action-wrapper {
  display: flex;
  justify-content: flex-end;
}
</style>
