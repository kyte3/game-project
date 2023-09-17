<template>
  <div>
    <HelloWorld></HelloWorld>

    <LoadScreen></LoadScreen>
  </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue';
import LoadScreen from './components/LoadScreen.vue';
import PhysicsGame from './components/PhysicsGame.vue';


//import stuff here

export default defineComponent({ components: { LoadScreen, PhysicsGame } });

</script>