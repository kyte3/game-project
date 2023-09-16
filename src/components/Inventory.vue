<template>
    <div class="inventory">
        <v-sheet :width="300" :height="600" color="black">
            <v-container>
                <v-col>
                    <v-row style="height: 115px;" v-for="n in potCount" :key="n">
                        Hi
                    </v-row>
                </v-col>
            </v-container>
        </v-sheet>
    </div>
</template>

<script lang="ts">

import { defineComponent } from 'vue';

export default defineComponent({
    data() {

    },

    methods: {

    },

    props: ['potCount']

})

</script>