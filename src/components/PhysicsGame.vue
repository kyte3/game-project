<template>
    <div class="container">
        <div ref="canvas" class="game">
        </div>

        <div class="inventory">
            <v-sheet :width="300" :height="600" color="black">
                <v-container>
                    <v-col>
                        <!--<div v-for="pot of pots" :key="pot.id">
                            <PotInfo :pot="{pot}" />
                        </div>-->
                        <v-row style="height: 115px;" v-for="n in pots.length" :key="n">
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
                                        <v-row class="custom-offset">{{ }}</v-row>
                                        <v-row>{{ }} days</v-row>
                                        <v-row>{{ }}%</v-row>
                                        <v-row>${{ }}</v-row>
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
            <v-btn @click="genPlant()" icon="mdi-pot" variant="tonal"></v-btn>
            <v-btn variant="tonal" icon="mdi-seed-plus" @click=""></v-btn>
            <v-btn variant="tonal" icon="mdi-clock" @click="advanceTime()"></v-btn>
            <Plant v-for="plant of pots" :key="plant.id" :growth-rate="plant.growthRate" :pot-i-d="plant.id"
                @send-pot="potListener" />
            <p class="pa-4"> Pot count: {{ pots.length }}
            </p>
        </v-sheet>
    </div>
</template>

<script lang="ts">

import { defineComponent } from 'vue';
import Matter from 'matter-js';
import Plant from './Plant.vue';

//THIS IS WRONG, PLEASE FIX
export default defineComponent({
    data() {
        return {
            engine: null as any,
            render: null as any,
            mouseConstraint: null as any,
            maxPots: 5,
            pots: [] as Array<any>,
            potVelocity: 0 as any,
            makePlant: [
                false,
                false,
                false,
                false,
            ],
        };
    }, //WHAT ARE YOU THINKING?
    mounted() {
        this.initializePhysics();
    },
    beforeUnmount() {
        if (this.engine) {
            Matter.Engine.clear(this.engine);
        }
    },
    watch: {
        potCount() {
            console.log(this.pots.length);
        }
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

                Matter.Body.setPosition(currentBody, Matter.Vector.create(400, 100));
                Matter.Body.setSpeed(currentBody, 0);
                //console.log('Pot detected out of bounds, relocated');
            });
            // Start the engine
            Matter.Runner.run(this.engine);
            // Run the renderer
            Matter.Render.run(this.render);
        },
        potListener(potData: any) {
            console.log(potData);
            // Add to world
            console.log('logging before matter init', [potData]);
            Matter.World.add(this.engine.world, [potData]);
        },
        genPlant() {
            this.pots.push({
                id: this.pots.length ?? 0 + 1,
                growthRate: Math.random(),
            });
        },
        deletePot() {
        },
        highlightPlant(id = -1) {
            // Highlight clicked plant
            console.log([id, this.pots[id - 1]])
            Matter.Body.setVelocity(this.pots[id - 1], Matter.Vector.create(0, -5))
        },
        advanceTime() {

        },
    },
    components: {
        Plant,
    }
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