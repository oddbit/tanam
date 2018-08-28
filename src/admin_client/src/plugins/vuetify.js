import Vue from 'vue';
import {
  Vuetify,
  VApp,
  VNavigationDrawer,
  VFooter,
  VList,
  VBtn,
  VIcon,
  VGrid,
  VToolbar,
  VSubheader,
  VCard,
  VMenu,
  VForm,
  VTextField,
  VDialog,
  VTabs,
  VDatePicker,
  VTimePicker,
  VSelect,
  VDivider,
  transitions
} from 'vuetify';
import 'vuetify/src/stylus/app.styl';

Vue.use(Vuetify, {
  components: {
    VApp,
    VNavigationDrawer,
    VFooter,
    VList,
    VBtn,
    VIcon,
    VGrid,
    VToolbar,
    VSubheader,
    VCard,
    VMenu,
    VForm,
    VTextField,
    VDialog,
    VTabs,
    VDatePicker,
    VTimePicker,
    VSelect,
    VDivider,
    transitions
  },
  theme: {
    primary: '#4caf50'
  }
});
