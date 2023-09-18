<template>
    <div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import Matter from 'matter-js';

type potProperties = {  // For flexibility in future
    baseWidth: number,
    baseHeight: number,
    baseSlope: number,
    topWidth: number,
    topHeight: number,
    palette: Array<string>
}

export default defineComponent({
    props: {
        growthRate: Number as PropType<number>,
        potID: Number as PropType<number>,
    },
    data() {
        return {
            age: 0 as number,
            potInstance: {
                baseWidth: 0,
                baseHeight: 0,
                baseSlope: 0,
                topWidth: 0,
                topHeight: 0,
                palette: ['rgba(203,104,67,1)', 'rgba(163,82,51,1)']    // [1]: pot base colour, [1]: pot top colour, [2]: new growth/sapling colour, [3]: mature colour, [4]: leaf colour
            } as potProperties,
            cells: [] as Array<Matter.Body>,    // Store new growth 'cells'
        }
    },
    mounted() {
        this.create(true, [], [400, 200]);
    },
    methods: {
        create(newPlant: boolean, bodyArray: Array<Matter.Body>, potPosition: Array<number>) {  // Now used when updating pot to retain original properties

            if (newPlant) {
                // Randomise dimensions (only if plant is being newly generated)
                this.potInstance.baseWidth = Math.floor((Math.random() * 40) + 30);
                this.potInstance.baseHeight = Math.floor((Math.random() * 40) + 40);
                this.potInstance.baseSlope = Math.random() * -0.4;

                this.potInstance.topWidth = this.potInstance.baseWidth * (1.1 + -this.potInstance.baseSlope);
                this.potInstance.topHeight = 20;
            };

            // Create pot
            const base = Matter.Bodies.trapezoid(potPosition[0], potPosition[1], this.potInstance.baseWidth, this.potInstance.baseHeight, this.potInstance.baseSlope, {
                render: {
                    fillStyle: this.potInstance.palette[0],
                },
                chamfer: {
                    radius: 5
                }
            });

            const top = Matter.Bodies.rectangle(potPosition[0], potPosition[1] - this.potInstance.baseHeight / 2, this.potInstance.topWidth, this.potInstance.topHeight, {
                render: {
                    fillStyle: this.potInstance.palette[1],
                },
                chamfer: {
                    radius: 5
                }
            });

            bodyArray.push(base, top);

            const pot = Matter.Body.create({
                parts: bodyArray,
            });

            if (newPlant) {
                // send pot to parent
                this.$emit('send-pot', pot);
                return;
            };

            return pot; // Return pot only if called from grow function
        },
        grow(plant: Matter.Body) {
            if (this.age == 0) {
                // Plant has not yet started growing; generate sapling
                const seed = Math.random(); // Get it? Seed? Like for the randomness? And because it's a plant?
                const seedB = seed * 10 - Math.floor(seed * 10);
                const seedC = seed * 100 - Math.floor(seed * 100); // Hopefully a less strenuous way to get some extra variety than generating new random numbers

                // Set colour palette
                this.potInstance.palette.push(`rgba(${seed * 20 + 90},${seed * 40 + 200},${seed * 70 + 20},1)`);  // Sapling colour
                this.potInstance.palette.push(`rgba(${seedB * 30 + 30},${seedB * 40 + 110},${seedB * 20 + 50},1)`);  // Mature colour
                this.potInstance.palette.push(`rgba(${seedC * 20 + 90},${seedC * 40 + 200},${seedC * 70 + 20},1)`);  // Leaf colour

                // Determine sapling size
                const saplingWidth = this.potInstance.baseWidth * (0.125 + (seed - 0.5) * 0.1);  // Sapling will be roughly 1/8th the width of the pot
                const saplingHeight = this.potInstance.baseHeight * (0.2 + (seed - 0.5) * 0.1);   // Sap height around 1/5th pot height

                // Define sapling vertices
                const saplingVertices = [[{ x: 0, y: 0 }, { x: saplingWidth, y: 0 }, { x: saplingWidth / 2, y: -saplingHeight }]] as Array<any>; // may need to offset vertices by plant.angle!

                // Create the sapling body
                const sapling = Matter.Bodies.fromVertices(plant.position.x, plant.position.y - this.potInstance.baseHeight / 2 - this.potInstance.topHeight / 2, saplingVertices, {
                    render: {
                        fillStyle: this.potInstance.palette[2],
                    }
                });
                this.cells.push(sapling);

                // Assemble plant
                const grownPlant = this.create(false, [sapling], [plant.position.x, plant.position.y]);

                this.$emit('send-grown', [grownPlant, this.potID, plant.angle])
            };

            this.age += 1;

        },
    }
})



</script>