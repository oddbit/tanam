<template>
  <v-card>
    <v-card-title class="card-title">Profile</v-card-title>

    <v-form>
      <v-container fluid grid-list-lg>
        <v-layout wrap>
          <v-flex xs12 md4 class="mobile-flex mobile-justify-center">
            <div class="img-wrapper">
              <input 
                ref="inputAvatar"
                type="file" 
                name="avatar" 
                accept="image/*"
                class="input-avatar"
                @change="handleChangeAvatar">
              <img :src="avatar">
              <span class="bg-overlay" />
              <span class="action" @click="handleClickAvatar">
                <v-icon dark large>cloud_upload</v-icon>
                <p>Click to change photo</p>
              </span>
            </div>
          </v-flex>
          <v-flex xs12 md8>
            <v-text-field name="firstName" label="First Name" v-model="firstName" />
            <v-text-field name="lastName" label="Last Name" v-model="lastName" />
          </v-flex>
        </v-layout>
        <v-layout>
          <v-flex xs12>
            <v-text-field name="publicDisplay" label="Public Display Name" v-model="publicDisplay" />
            <v-text-field 
              name="about" 
              label="About Me" 
              v-model="about"
              multi-line />
          </v-flex>
        </v-layout>
        <v-layout justify-end>
          <v-btn color="primary">Save Profile</v-btn>
        </v-layout>
      </v-container>
    </v-form>

  </v-card>
</template>

<script>
import gravatar from '@/assets/images/gravatar.jpg';

export default {
  data: () => ({
    avatar: gravatar,
    firstName: null,
    lastName: null,
    publicDisplay: null,
    about: null
  }),
  methods: {
    handleClickAvatar() {
      this.$refs.inputAvatar.click();
    },
    handleChangeAvatar(event) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = e => {
        this.avatar = e.target.result;
      };
    }
  }
};
</script>


<style lang="scss" scoped>
.card-title {
  border-bottom: 1px solid #eee;
  font-weight: 500;
}
.img-wrapper {
  display: flex;
  position: relative;
  display: flex;
  align-items: center;
  width: 150px;
  height: 150px;
  cursor: pointer;
  img {
    max-width: 100%;
    height: 100%;
    border-radius: 100%;
    object-fit: cover;
  }
  .input-avatar {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    display: none;
  }
  .bg-overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.4);
    border-radius: 100%;
  }
  .action {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    color: #fff;
    p {
      margin-bottom: 0;
      padding: 0 1em;
    }
  }
}
</style>
