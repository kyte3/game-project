<template>
    <div>
        <div ref="canvas"></div>
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
        }
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
                element: (this.$refs.canvas as any), // force canvas to be 'any' type
                engine: this.engine,
                options: {
                    wireframes: false
                }
            });

            // Create Matter.js bodies
            const base = Matter.Bodies.trapezoid(400, 200, 60, 80, -0.3, {
                render: {
                    fillStyle: 'rgba(203,104,67,1)',
                },
                chamfer: {
                    radius: 5
                }

            });
            const top = Matter.Bodies.rectangle(400, 160, 90, 20, {
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

            const ground = Matter.Bodies.rectangle(400, 600, 1000, 40, { isStatic: true });

            // Add the bodies to the world
            Matter.World.add(this.engine.world, [pot, ground]);

            // Initialise Mouse Interaction
            const canvas = this.$refs.canvas as any;
            const mouse = Matter.Mouse.create(canvas);
            const mouseConstraint = Matter.MouseConstraint.create(this.engine, {
                mouse: mouse,
                constraint: {
                    render: { visible: false }
                }
            });
            Matter.World.add(this.engine.world, mouseConstraint);
            this.render.mouse = mouse;

            // Start the engine
            Matter.Engine.run(this.engine);

            // Run the renderer
            Matter.Render.run(this.render);
        },
    }
})

</script>
  