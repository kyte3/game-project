<template>
  <div>
    <v-btn @click="ChangeName" class="text-pink" append-icon="mdi-swap-horizontal" prepend-icon="mdi-swap-horizontal">
      CLICK ME OR DIE, {{ name }}
    </v-btn>
  </div>
</template>

<script lang="ts">
//import stuff here

import { defineComponent } from 'vue';

export default defineComponent({
  data() {
    return {
      name: 'kyte'
    };
  },
  watch: {

  },
  methods: {
    ChangeName() {
      if (this.name === 'kyte') {
        this.name = 'john';
      }
      else {
        this.name = 'kyte';
      }
    }
  }

})

</script>

