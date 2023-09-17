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
            age: 0 as number,
            potDimensions: [] as Array<number>, // [0]: base width, [1]: base height, [2]: top width, [3]: top height
            colours: [] as Array<string>,   // [0]: new growth/sapling colour; [1]: mature colour; [2]: leaf colour
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

            // Save pot
            this.potDimensions = [potWidth, potHeight, potWidth * (1.1 + -potSlope), 20];

            // send pot to parent
            this.$emit('send-pot', pot);
        },
        grow(plant: Matter.Body) {
            if (this.age == 0) {
                // Plant has not yet started growing; generate sapling
                const seed = Math.random(); // Get it? Seed? Like for the randomness? And because it's a plant?
                const seedB = seed * 10 - Math.floor(seed * 10);
                const seedC = seed * 100 - Math.floor(seed * 100); // Hopefully a less strenuous way to get some extra variety than generating new random numbers

                // Set colour palette
                this.colours.push(`rgba(${seed * 20 + 90},${seed * 40 + 200},${seed * 70 + 20},1)`);  // Sapling colour
                this.colours.push(`rgba(${seedB * 30 + 30},${seedB * 40 + 110},${seedB * 20 + 50},1)`);  // Mature colour
                this.colours.push(`rgba(${seedC * 20 + 90},${seedC * 40 + 200},${seedC * 70 + 20},1)`);  // Leaf colour

                // Determine sapling size
                const saplingWidth = this.potDimensions[0] * (0.125 + (seed - 0.5) * 0.1);  // Sapling will be roughly 1/8th the width of the pot
                const saplingHeight = this.potDimensions[1] * (0.2 + (seed - 0.5) * 0.1);   // Sap height around 1/5th pot height

                // Define sapling vertices
                const saplingVertices = [[{ x: 0, y: 0 }, { x: saplingWidth, y: 0 }, { x: saplingWidth / 2, y: saplingHeight }]] as Array<any>; // may need to offset vertices by plant.angle!

                // Create the sapling body
                const sapling = Matter.Bodies.fromVertices(plant.position.x, plant.position.y, saplingVertices, {
                    render: {
                        fillStyle: this.colours[0],
                    }
                });

                // Assemble plant
                const grownPlant = Matter.Body.create({
                    parts: [plant, sapling]
                });

                this.$emit('send-grown', [grownPlant, this.potID])
            };

            this.age += 1;

        },
    }
})



</script>