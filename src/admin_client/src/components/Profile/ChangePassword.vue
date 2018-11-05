<template>
  <v-card>
    <v-card-title class="card-title px-4">Change Password</v-card-title>
    
    <v-container fluid grid-list-xl>
      <v-layout column>
        <v-flex>

          <p class="text-xs-left">To update your password enter a new one below. Your password should be at least six characters long. To make it stronger, use upper and lower case letters, numbers and symbols like ! " ? $ % ^ & ).</p>
        
          <v-form>
            <v-text-field
              v-model="currentPassword"
              :type="controlCurrent ? 'password' : 'text'"
              :append-icon="controlCurrent ? 'visibility_off' : 'visibility'"
              :append-icon-cb="() => (controlCurrent = !controlCurrent)"
              name="currentPassword"
              label="Current Password"
            />
            <v-text-field
              v-model="newPassword"
              :type="controlNew ? 'password' : 'text'"
              :append-icon="controlNew ? 'visibility_off' : 'visibility'"
              :append-icon-cb="() => (controlNew = !controlNew)"
              name="newPassword"
              label="New Password"
            />
            <v-text-field
              v-model="confirmPassword"
              :type="controlConfirm ? 'password' : 'text'"
              :append-icon="controlConfirm ? 'visibility_off' : 'visibility'"
              :append-icon-cb="() => (controlConfirm = !controlConfirm)"
              name="confirmPassword"
              label="Confirm Password"
            />
          
            <v-layout>
              <v-flex d-flex justify-end>
                <v-btn color="primary" class="btn-save ma-0">Save Password</v-btn>
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
    controlCurrent: true,
    controlNew: true,
    controlConfirm: true,
    currentPassword: null,
    newPassword: null,
    confirmPassword: null
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
