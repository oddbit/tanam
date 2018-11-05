<template>
  <v-card>
    <v-card-title class="card-title px-4">Account</v-card-title>
    
    <v-container grid-list-xl>
      <v-layout>
        <v-flex>
          <v-form>
            <v-text-field v-model="username" name="username" label="Username" />
            <v-text-field 
              :value="email" 
              name="email" 
              label="Email" 
              disabled />

            <v-layout>
              <v-flex d-flex justify-end>
                <v-btn color="primary" class="btn-save ma-0">Save Account</v-btn>
              </v-flex>
            </v-layout>

          </v-form>        
        </v-flex>
      </v-layout>
    </v-container>
  </v-card>
</template>

<script>
export default {
  data: () => ({
    username: 'anandaprabawa',
    email: 'ananda@oddbit.id'
  })
};
</script>


<style lang="scss" scoped>
.card-title {
  border-bottom: 1px solid #eee;
  font-weight: 500;
}
.btn-save {
  flex: 0 1 auto !important;
}
</style>
