<template>
  <v-container>
    <v-layout justify-center class="py-4">
      <v-flex xs12 md8>
        <Account />
        <span class="d-flex my-2" />
        <ChangePassword />
        <span class="d-flex my-2" />
        <DeleteAccount />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import Account from '@/components/Profile/Account';
import ChangePassword from '@/components/Profile/ChangePassword';
import DeleteAccount from '@/components/Profile/DeleteAccount';

export default {
  components: {
    Account,
    ChangePassword,
    DeleteAccount
  }
};
</script>
