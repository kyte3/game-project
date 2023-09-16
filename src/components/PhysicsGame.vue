<template>
    <div class="container">
        <div ref="canvas" class="game">
        </div>

        <div class="inventory">
            <v-sheet :width="300" :height="600" color="black">
                <v-container>
                    <v-col>
                        <v-row style="height: 115px;" v-for="n in potCount" :key="n">
                            <v-sheet rounded color="green" width="280" height="100">
                                <v-row>
                                    <v-col cols="4">
                                        <v-btn style="margin-top: 35%; " icon="mdi-flower-tulip"
                                            @click="highlightPlant(n)"></v-btn>
                                    </v-col>
                                    <v-col cols="3">
                                        <v-row class="custom-offset">Species</v-row>
                                        <v-row>Age</v-row>
                                        <v-row>Health</v-row>
                                        <v-row>Value</v-row>
                                    </v-col>
                                    <v-col cols="3">
                                        <v-row class="custom-offset">{{ species[n - 1] }}</v-row>
                                        <v-row>{{ age[n - 1] }} days</v-row>
                                        <v-row>{{ health[n - 1] }}%</v-row>
                                        <v-row>${{ value[n - 1] }}</v-row>
                                    </v-col>
                                </v-row>
                            </v-sheet>
                        </v-row>
                    </v-col>
                </v-container>
            </v-sheet>
        </div>
    </div>
    <div ref="devcontrols">
        <v-sheet :height="200" :width="800" color="black" class="pa-6">
            <v-btn variant="tonal" icon="mdi-pot" @click="generatePot()"></v-btn>
            <v-btn variant="tonal" icon="mdi-seed-plus" @click=""></v-btn>
            <v-btn variant="tonal" icon="mdi-clock"></v-btn>
            <p class="pa-4"> Pot count: {{ potCount }} Pot velocity: {{ potVelocity }}
            </p>
        </v-sheet>
    </div>
</template>
  
<script lang="ts">

import { defineComponent } from 'vue';
import Matter from 'matter-js';

export default defineComponent({
    data() {
        return {
            engine: null as any,
            render: null as any,
            mouseConstraint: null as any,
            maxPots: 5,
            pots: [] as Array<any>,
            species: [] as Array<any>,
            age: [] as Array<any>,
            health: [] as Array<any>,
            value: [] as Array<any>,
            potCount: 0,
            potVelocity: 0 as any,
        };
    },
    mounted() {
        this.initializePhysics();
    },
    methods: {
        initializePhysics() {
            // Create an instance of the Matter.js Engine
            this.engine = Matter.Engine.create();
            // Create a Matter.js Render object for rendering to the canvas
            this.render = Matter.Render.create({
                element: (this.$refs.canvas as any),
                engine: this.engine,
                options: {
                    wireframes: false
                }
            });
            // Create ground
            const ground = Matter.Bodies.rectangle(400, 600, 850, 40, { isStatic: true });
            const worldBottom = Matter.Bodies.rectangle(400, 1000, 100000, 40, { isStatic: true });
            // Add the bodies to the world
            Matter.World.add(this.engine.world, [ground, worldBottom]);
            // Initialise Mouse Interaction
            const canvas = this.$refs.canvas as any;
            const mouse = Matter.Mouse.create(canvas);
            this.mouseConstraint = Matter.MouseConstraint.create(this.engine, {
                mouse: mouse,
                constraint: {
                    render: { visible: false }
                }
            });
            Matter.World.add(this.engine.world, this.mouseConstraint);
            this.render.mouse = mouse;
            // Listeners
            Matter.Events.on(this.engine, 'collisionStart', (event) => {
                let currentBody = event.pairs[0].bodyB;
                if (currentBody.position.x > 0) {
                    if (currentBody.position.x < 800) {
                        //console.log('Legal collision detected');
                        return;
                    }
                    ;
                }
                ;
                if (currentBody.parent != currentBody) {
                    currentBody = currentBody.parent;
                }
                ;
                //while (Matter.Body.getSpeed(currentBody) != 0) { };
                Matter.Body.setPosition(currentBody, Matter.Vector.create(400, 100));
                Matter.Body.setSpeed(currentBody, 0);
                //console.log('Pot detected out of bounds, relocated');
            });
            // Start the engine
            Matter.Runner.run(this.engine);
            // Run the renderer
            Matter.Render.run(this.render);
        },
        generatePot() {
            // Max number of concurrent pots
            if (this.potCount >= this.maxPots) {
                return null;
            }
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
            // Add pot to pots array
            this.pots[this.potCount] = pot;

            // Add new plant to inventory
            this.generatePlant([potWidth, potHeight, potSlope], this.potCount);

            // Add the bodies to the world
            Matter.World.add(this.engine.world, [pot]);
            this.potCount += 1;
        },
        deletePot() {
        },
        generatePlant(potSize = [0, 0, 0], potID = -1) {
            console.log(['Generating new plant', potID, potSize])

            // Add plant to inventory
            this.species[potID] = 'Oak';
            this.age[potID] = 0;
            this.value[potID] = 0;
            this.health[potID] = 100;


        },
        highlightPlant(id = -1) {
            // Highlight clicked plant
            console.log([id, this.pots[id - 1]])
            Matter.Body.setVelocity(this.pots[id - 1], Matter.Vector.create(0, -5))
        }
    },
})

</script>
  

<style scoped>
.container {
    display: flex;
    gap: 6px;
}

.game {
    flex: 1;
}

.inventory {
    flex: 1;
}

.custom-offset {
    margin-top: 0px;
}
</style>