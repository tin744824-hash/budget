"use client"

import { usePathname } from "next/navigation"
import { motion } from "motion/react"
import "./navBar.css"
import Link from "next/link"
import { useRef } from "react"
import { animate } from "motion"

function NavBar() {
    const pages = ["overview", "ledger", "allocations", "goals"]
    const pathname = usePathname()
    const navLineRef = useRef()
    
    const handleNavLinkClick = (e) => {
        animate(navLineRef, {  })
    }

    return (
        <div className="navBar bg-vanilla-100 w-screen h-16 flex items-center justify-between pl-6 pr-6">
            <h2 className="text-2xl font-black" style={{fontFamily: "var(--font-bricolage)"}}>Margin</h2>
            <div className="navLinks gap-4 flex font-medium text-blue-400/70 relative">
                {
                    pages.map((page, index) => {
                        const selectedPath = (pathname == `/${page}`)
                        return <Link 
                                key={index} 
                                href={"/" + page.toLowerCase()}
                                className={"relative navLink" + (selectedPath ? " active" : "")}
                            >
                                {page.charAt(0).toUpperCase() + page.slice(1).toLowerCase()}
                                {selectedPath ? <motion.div className="navLine" layoutId="navLine" transition={{ type: "spring", damping: 25, stiffness: 325 }}></motion.div> : null}
                            </Link>
                    })
                }
            </div>
        </div>
    )
}

export default NavBar