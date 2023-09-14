<template>
    <div>
        <div ref="canvas"></div>
    </div>
</template>
  
<script lang="ts">

import { defineComponent } from 'vue';
import Matter from 'matter-js';

export default defineComponent({

    mounted() {
        this.initializePhysics();
    },
    methods: {
        initializePhysics() {
            // Create an instance of the Matter.js Engine
            const engine = Matter.Engine.create();

            // Create a Matter.js Render object for rendering to the canvas
            const render = Matter.Render.create({
                element: (this.$refs.canvas as any), // force canvas to be 'any' type
                engine: engine,
            });

            // Create some Matter.js bodies (e.g., a rectangle)
            const box = Matter.Bodies.rectangle(400, 200, 80, 80, { isStatic: false });
            const ground = Matter.Bodies.rectangle(400, 600, 1000, 40, { isStatic: true });

            // Add the bodies to the world
            Matter.World.add(engine.world, [box, ground]);

            // Initialise Mouse Interaction
            const canvas = this.$refs.canvas as any;
            const mouse = Matter.Mouse.create(canvas);

            const mouseConstraint = Matter.MouseConstraint.create(engine, {
                mouse: mouse,
            });

            Matter.World.add(engine.world, mouseConstraint);

            render.mouse = mouse;


            // Start the engine
            Matter.Engine.run(engine);

            // Run the renderer
            Matter.Render.run(render);
        },
    },

})

</script>
  