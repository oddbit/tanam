<template>
  <div class="featured-img-wrapper">
    <div v-if="postFeaturedImage" class="img-wrapper"><img :src="postFeaturedImage"></div>
    <v-btn v-if="!postFeaturedImage" class="btn-set" @click="$refs.featuredImg.click()">Set Featured Image</v-btn>
    <v-btn 
      v-else 
      icon 
      small
      @click="$emit('handleCloseFeaturedImg', $refs.featuredImg)"
      class="btn-close elevation-4" 
      color="white"><v-icon small>close</v-icon></v-btn>
    <input 
      ref="featuredImg" 
      type="file" 
      @change="(event) => $emit('handleChangeFeaturedImg', event)"
      class="input-img">
  </div>
</template>

<script>
export default {
  props: {
    postFeaturedImage: {
      type: String,
      default: null
    }
  }
};
</script>

<style lang="scss" scoped>
.featured-img-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ddd;
  position: relative;
  padding-top: 56.25%;
  margin: 16px 0;

  .btn-set {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    margin: 0;
  }

  .input-img {
    display: none;
  }

  .btn-close {
    position: absolute;
    top: -16px;
    right: -16px;
  }

  .img-wrapper {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}
</style>
