"use client";

import { motion, useAnimationControls } from "motion/react";
import { TransitionRouter } from "next-transition-router";

export default function TransitionProviders({ children }: { children: React.ReactNode }) {
    const controls = useAnimationControls();

    return (
        <TransitionRouter
            leave={async (next) => {
                await controls.start({
                    y: [0, "-175vh"],
                    transition: { duration: 2, ease: "anticipate" }
                }).then(() => {
                    console.log("leave")
                    controls.stop()
                });
                next();
            }}
            enter={async (next) => {
                await controls.start({
                    y: ["-175vh", "-300vh"],
                    transition: { duration: 2, ease: "anticipate" }
                }).then(() => {
                    console.log("enter")
                    controls.stop()
                });
                next();
            }}
        >
            <motion.div initial={{y:0}} animate={controls} className="overlay fixed translate-y-full inset-0 w-screen h-[150vh]" style={{background: "#659b50", zIndex: 1000}}></motion.div>
            {children}
        </TransitionRouter>
    );
}