<template>
  <div>
    <div>
      <v-btn v-if="ButtonStatus" @click="LoadGame"> LOAD GAME </v-btn>
      <PhysicsGame v-if="!ButtonStatus"></PhysicsGame>
    </div>
  </div>
</template>

<script lang="ts">

import { defineComponent } from 'vue';
import PhysicsGame from './PhysicsGame.vue';

export default defineComponent({

  data() {
    return {
      ButtonStatus: true
    };
  },

  methods: {

    // LoadGame function calls two functions, HideButton and InitPhysics
    LoadGame() {
      this.HideButton()
      this.InitPhysics()
    },

    // HideButton uses v-if to conditionally render the button (hide it) on click
    HideButton() {
      this.ButtonStatus = !this.ButtonStatus;
    },

    // InitPhysics starts matter.js renderer
    InitPhysics() {

    }
  },

  components: { PhysicsGame },

})


</script>