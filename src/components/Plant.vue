<template>
    <div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import Matter from 'matter-js';

export default defineComponent({
    props: {
        growthRate: Number as PropType<number>,
        potID: Number as PropType<number>,
    },
    data() {
        return {
            age: 0,
        }
    },
    mounted() {
        this.create();
    },
    methods: {
        create() {
            // Randomise Dimensions
            let potWidth = Math.floor((Math.random() * 40) + 30);
            let potHeight = Math.floor((Math.random() * 40) + 40);
            let potSlope = Math.random() * -0.4;

            // Create pot
            const base = Matter.Bodies.trapezoid(400, 200, potWidth, potHeight, potSlope, {
                render: {
                    fillStyle: 'rgba(203,104,67,1)',
                },
                chamfer: {
                    radius: 5
                }
            });
            const top = Matter.Bodies.rectangle(400, 200 - potHeight / 2, potWidth * (1.1 + -potSlope), 20, {
                render: {
                    fillStyle: 'rgba(163,82,51,1)'
                },
                chamfer: {
                    radius: 5
                }
            });
            const pot = Matter.Body.create({
                parts: [base, top],
            });

            console.log('emitting event send pot');
            // send pot to parent
            this.$emit('send-pot', pot);
        },
    }
})



</script>