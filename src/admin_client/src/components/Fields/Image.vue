<template>
  <div>
    <img :src="imageSrc">
    <div>
      <input 
        :ref="`${name}Ref`"
        type="file" 
        :name="name" 
        :id="name" 
        accept="image/*"
        :multiple="multiple"
        class="input-image-field"
        @change="handleChangeImage">
      <v-btn color="primary" @click="handleClickUpload">Upload Image</v-btn>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    imageSrc: null
  }),
  props: {
    name: {
      type: String,
      default: 'image'
    },
    multiple: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleClickUpload() {
      this.$refs[`${this.name}Ref`].click();
    },
    handleChangeImage(val) {
      const reader = new FileReader();
      reader.readAsDataURL(val.target.files[0]);
      reader.onload = () => {
        this.imageSrc = reader.result;
        this.$refs[`${this.name}Ref`].value = null;
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.input-image-field {
  display: none;
}
</style>
