<template>
  <div>
    <div class="container">
      <img v-if="imageSrc" :src="imageSrc" >
      <img v-else src="@/assets/images/img-placeholder.png">
      <v-btn color="blue-grey darken-1" v-if="imageSrc" class="btn btn-delete" @click="deleteImage">X</v-btn>
      <v-btn color="blue-grey darken-1" v-else class="btn btn-upload" @click="handleClickUpload">UPLOAD IMAGE</v-btn>
    </div>
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
      this.$emit('changeImage', val.target.files[0]);
      const reader = new FileReader();
      reader.readAsDataURL(val.target.files[0]);
      reader.onload = () => {
        this.imageSrc = reader.result;
        this.$refs[`${this.name}Ref`].value = null;
      };
    },
    deleteImage() {
      this.imageSrc = null;
      this.$emit('changeImage', null);
    }
  }
};
</script>

<style lang="scss" scoped>
.input-image-field {
  display: none;
}

img {
  height: 100%;
  width: 100%;
  max-height: 400px;
  max-width: 400px;
}

.container {
  position: relative;
  width: 100%;
  max-width: 400px;
}

.container .btn {
  position: absolute;
  color: white;
  font-size: 16px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  text-align: center;
}

.btn-delete {
  top: 20px;
  right: 20px;
}

.btn-upload {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
}
</style>
