<template>
  <div>
    <HelloWorld></HelloWorld>

    <MatterJS></MatterJS>
  </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue';
import HelloWorld from './components/HelloWorld.vue';
import MatterJS from './components/MatterJS.vue';
import PhysicsGame from './components/PhysicsGame.vue';


//import stuff here

export default defineComponent({ components: { MatterJS, PhysicsGame } });

</script>