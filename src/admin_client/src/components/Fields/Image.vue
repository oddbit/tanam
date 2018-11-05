<template>
  <div class="wrapper">
    <span class="label mb-2">{{ label }}</span>
    <div :class="{'margin-auto': imageSrc}" class="image-container">
      <img v-if="imageSrc" :src="imageSrc">
      <img v-else-if="value && value.url" :src="value.url">
      <img v-else src="@/assets/images/img-placeholder.png" class="placeholder-img">
      <v-btn 
        v-if="imageSrc || (value && value.url)" 
        color="white" 
        class="btn btn-delete elevation-5" 
        icon
        @click="deleteImage">
        <v-icon>close</v-icon>
      </v-btn>
      <v-btn 
        v-else 
        color="primary" 
        class="btn btn-upload" 
        @click="handleClickUpload">UPLOAD IMAGE</v-btn>
      <input 
        :ref="`${name}Ref`"
        :name="name" 
        :id="name" 
        :multiple="multiple" 
        type="file"
        accept="image/*"
        class="input-image-field"
        @change="handleChangeImage">
    </div>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: 'image'
    },
    multiple: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: 'Label'
    },
    value: {
      type: Object,
      default: () => ({})
    }
  },
  data: () => ({
    imageSrc: null
  }),
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
.wrapper {
  display: flex;
  flex-direction: column;
}

.label {
  font-size: 16px;
  color: rgba(0, 0, 0, 0.54);
}

.input-image-field {
  display: none;
}

.margin-auto {
  margin: 0 auto;
}

.image-container {
  position: relative;
  max-width: 100%;

  img {
    max-height: 500px;
    max-width: 100%;
  }

  .btn {
    position: absolute;
  }

  .placeholder-img {
    min-width: 100%;
    width: 100%;
    height: 150px;
    object-fit: cover;
  }
}

.btn-delete {
  top: 0;
  right: 0;
}

.btn-upload {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
