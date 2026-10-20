'use client'

import { Button } from "@/components/ui/button";
import { motion, animate, stagger } from "motion/react" 
import { useEffect, useId, useRef, useState } from "react";
import { Link, useTransitionRouter } from "next-transition-router";
import "./_css/page.css";
import { useRouter } from "next/navigation";

const budgetSet = 400
const budgetLeft = 0
const budgetPercent = (budgetSet - budgetLeft) / budgetSet

function debounce(func, delay = 200) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

export default function BudgetIndex() {  
    const id = useId().replace(/[^a-zA-Z0-9_-]/g, '')
    const sunRef = useRef(null)
    const landscapeRef = useRef(null)
    const [currentVal, setCurrentVal] = useState(budgetSet)
    const router = useTransitionRouter()

    const pageTransition = () => {
        animate(".hill", { y: "-100vh" }, { duration: 2.5, ease: "anticipate", delay: stagger(0.2) })
        animate(".landscapeMove", { y: "-150vh" }, { duration: 2, ease: "anticipate", delay: 0.1 })
    }

    const handleClick = (e) => {
        e.preventDefault()
        pageTransition()
        router.push("/ledger")
    }

    useEffect(() => {
        const change = ((window.innerHeight - (sunRef.current.offsetHeight / 2) - (4*16) - landscapeRef.current.getBoundingClientRect().height ) * budgetPercent)  //Math.max(((window.innerHeight - (4*16) - landscapeRef.current.getBoundingClientRect().height ) * budgetPercent) - (sunRef.current.offsetHeight), ((window.innerHeight - landscapeRef.current.getBoundingClientRect().height ) * budgetPercent))
        animate(sunRef.current, { y: ["1em", change] }, { duration: 3, type: 'spring', onUpdate: (e) => setCurrentVal((e/change) * budgetLeft) })
        animate(".sunGridLine", { y: change }, { duration: 3, type: 'spring' })
        animate(".smile", { d: `M247 71 Q260 ${80 - (19 * budgetPercent)} 273 71` }, { duration: 1, ease: "easeInOut" })
        
        const handleResize = () => {
            const newChange = ((window.innerHeight - (sunRef.current.offsetHeight / 2) - (4*16) - landscapeRef.current.getBoundingClientRect().height ) * budgetPercent)
            console.log("done")
            animate(sunRef.current, { y: newChange }, { duration: 1.5, ease: 'easeInOut' })
            animate(".sunGridLine", { y: newChange }, { duration: 1.5, ease: 'easeInOut' })
            
        }

        window.addEventListener("resize", debounce(handleResize, 300))

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    return (
    <div className="relative budgetMain">
        <div className="absolute top-0 texts w-[55%] flex items-center justify-center h-[75vh] min-h-96">
            <div className="headline font-bold text-[3em] pl-4 pr-4 pt-2 pb-2">
                <h1 className="font-mono font-black text-8xl flex tracking-tighter"><span className="text-4xl">$</span>200.00</h1>
                <p className="ml-6 mt-[-0.5rem] mb-[-1rem] text-lg font-[400] italic">left to spend in September</p>
                {/* <Link data-transition-ignore href="/ledger" ><Button className="ml-5">Update Spending</Button></Link> */}
                <Button onClick={handleClick}>Update Spending</Button>
            </div>
        </div>
        <div className="gridLine absolute top-[6em] left-[1.5vw]">
            <div className="line w-[97vw] h-[0.75]"></div>
            <p className="budgetSet pr-5 mt-[-0.8em] w-fit"><span>${budgetSet.toFixed(2)}</span></p>
        </div>
        <div className="figures top-0 relative justify-end w-screen h-screen">
            <div className="sunBox w-[30%] min-w-96 h-full absolute right-0 overflow-hidden">
                <div className="sunGridLine gridLine fixed left-[1.5vw] top-[6em]">
                    <div className="line w-[97vw] h-[0.75]"></div>
                    <p className="budgetSet pr-5 mt-[-0.8em] w-fit"><span>${currentVal.toFixed(2)}</span></p>
                </div>
                <div ref={sunRef} className="sun">
                <svg viewBox="0 -20 400 160" id="scene" className="sunSvg" style={{transform: "translateY(1em)"}}>
                        <filter id="grain">
                        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="4" result="noise" />
                        <feColorMatrix in="noise" type="matrix"
                            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -4.2 3.5" result="holes" />
                        <feComposite in="SourceGraphic" in2="holes" operator="in" />
                        </filter>
                    <defs>
                    <clipPath id="above"><rect x="0" y="-60" width="520" height="292"></rect></clipPath>
                    </defs>
                    <g aria-hidden="true">
                    
                    <g clipPath="url(#above)">
                    <motion.g id="sun-b" className="ink-b" animate={{y: [0, -3, 0]}} transition={{ duration: 3.3, repeat: Infinity, ease: "easeInOut" }}>
                        <g id="rays"><line className="ray grain-ink" x1="311.19406879332064" y1="75.7174093904336" x2="336.3081402768364" y2="82.44670456309913" opacity="1.000"></line><line className="ray grain-ink" x1="297.47665940288704" y1="99.47665940288701" x2="308.87522071561415" y2="110.87522071561416" opacity="1.000"></line><line className="ray grain-ink" x1="273.7174093904336" y1="113.19406879332061" x2="280.44670456309916" y2="138.30814027683638" opacity="1.000"></line><line className="ray grain-ink" x1="246.2825906095664" y1="113.19406879332061" x2="242.11042760251377" y2="128.7647931131004" opacity="1.000"></line><line className="ray grain-ink" x1="222.523340597113" y1="99.47665940288702" x2="204.13856428626275" y2="117.86143571373725" opacity="1.000"></line><line className="ray grain-ink" x1="208.8059312066794" y1="75.71740939043359" x2="193.2352068868996" y2="79.88957239748622" opacity="1.000"></line><line className="ray grain-ink" x1="208.8059312066794" y1="48.2825906095664" x2="183.6918597231636" y2="41.553295436900854" opacity="1.000"></line><line className="ray grain-ink" x1="222.523340597113" y1="24.52334059711297" x2="211.12477928438585" y2="13.124779284385824" opacity="1.000"></line><line className="ray grain-ink" x1="246.28259060956637" y1="10.80593120667939" x2="239.5532954369008" y2="-14.308140276836383" opacity="1.000"></line><line className="ray grain-ink" x1="273.7174093904336" y1="10.805931206679375" x2="277.8895723974862" y2="-4.76479311310041" opacity="1.000"></line><line className="ray grain-ink" x1="297.476659402887" y1="24.52334059711297" x2="315.86143571373725" y2="6.138564286262735" opacity="1.000"></line><line className="ray grain-ink" x1="311.19406879332064" y1="48.282590609566356" x2="326.7647931131004" y2="44.11042760251371" opacity="1.000"></line></g>
                    </motion.g>
                    <motion.g id="sun-a" className="grain-ink" transform="translate(-0.31 0.10)" animate={{y: [0, -3, 0]}} transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}>
                        <circle className="disc" id="disc" r="44" cx="260" cy="62"></circle>
                        <circle className="disc-over" id="disc-over" r="44" cx="260" cy="62" opacity="0.000"></circle>
                    </motion.g>
                    <motion.path className="smile ink-b" id="smile" d="M247 71 Q260 80 273 71" opacity="1.000" animate={{y: [0, -2, 0]}} transition={{ duration: 3.1, repeat: Infinity, ease: "easeInOut" }}></motion.path>
                    </g>
                    </g>
                </svg>
                </div>
          </div>
          <div
            className={"landscapeBox w-screen h-screen absolute bottom-0 grid content-end overflow-hidden"}
            style={{}}
            aria-hidden="true"
            >
            <div className="landscapeMove">
            <svg viewBox="0 0 1440 400" preserveAspectRatio="xMidYMax slice" className={"w-full landscape"}>
                <defs>
                {/* riso-style speckle, same idea as the sun's texture */}
                <filter id={`${id}-grain`} x="-2%" y="-2%" width="104%" height="104%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="7" result="n" />
                    <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -4.2 4" result="holes" />
                    <feComposite in="SourceGraphic" in2="holes" operator="in" />
                </filter>
                </defs>

                <rect className={""} x="0" y="60" width="1440" height="170" fill={`url(#${id}-haze)`} />

                <g filter={`url(#${id}-grain)`}>
                {/* far hills */}
                <motion.path ref={landscapeRef}
                    className={"far-hill hill"}
                    d="M0 205 C 160 150 330 160 500 188 S 830 140 1030 166 S 1310 196 1440 150 L1440 400 L0 400Z"
                    animate={{d: "M 0 205 C 167 164 328 196 500 188 S 824 173 1030 166 S 1312 186 1440 150 L 1440 400 L 0 400 Z"}}
                    transition={{ duration: 4, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
                />
                {/* middle hills */}
                <motion.path
                    className={"middle-hill hill"}
                    d="M0 268 C 190 222 380 246 570 258 S 920 208 1130 244 S 1350 282 1440 248 L1440 400 L0 400Z"
                    animate={{d: "M 0 268 C 190 222 399 265 570 246 S 923 195 1130 244 S 1350 282 1440 248 L 1440 400 L 0 400 Z"}}
                    transition={{ duration: 4.5, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
                />

                {/* trees on the middle hill */}
                {TREES.map(([x, y, s], i) => (
                    <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
                    <rect className={"trunk"} x="-3" y="-6" width="6" height="26" rx="2" />
                    <circle className={"canopy"} cx="0" cy="-22" r="22" />
                    <circle className={"canopyLight"} cx="-8" cy="-28" r="9" />
                    </g>
                ))}

                {/* the field in front */}
                <motion.path
                    className={"front-hill hill"}
                    d="M0 330 C 240 298 520 320 760 314 S 1180 290 1440 318 L1440 400 L0 400Z"
                    animate={{d: "M 0 330 C 249 319 520 320 757 318 S 1186 312 1440 318 L 1440 400 L 0 400 Z"}}
                    transition={{ duration: 3, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
                />
                {/* footpath winding up from the bottom */}
                <path
                    className={""}
                    d="M650 400 C 690 372 760 356 744 340 C 732 328 690 326 712 318 L736 318 C 718 328 770 334 786 344 C 806 360 760 380 760 400Z"
                />
                </g>

                {/* fireflies over the field, only once it gets dark */}
                <g className={"fireflies"}>
                {FIREFLIES.map(([x, y, r], i) => (
                    <circle key={i} cx={x} cy={y} r={r} />
                ))}
                </g>

                {/* grass tufts, drawn as short strokes */}
                <g className={"grass"}>
                {TUFTS.map(([x, y], i) => (
                    <path key={i} d={`M${x} ${y} l-4 -12 M${x + 5} ${y} l0 -15 M${x + 10} ${y} l4 -11`} />
                ))}
                </g>
            </svg>
            </div>
            </div>
        </div>
    </div>
  );
}

const TREES: [number, number, number][] = [
  [262, 236, 1],
  [304, 232, 0.8],
  [1006, 222, 1.1],
  [1056, 226, 0.85],
  [1236, 250, 0.7],
]
const TUFTS: [number, number][] = [
  [120, 352], [300, 344], [420, 360], [560, 340], [880, 336], [980, 352], [1120, 338], [1300, 350],
]
const FIREFLIES: [number, number, number][] = [
  [180, 300, 3.3], [380, 286, 2.7], [470, 330, 3.6], [640, 296, 2.7], [860, 302, 3.3],
  [940, 268, 2.4], [1150, 296, 3.0], [1330, 284, 2.7], [1210, 336, 3.6], [90, 344, 2.4],
]

// food, transport, fixed fees
// others: donation

// analysis

// saving goals