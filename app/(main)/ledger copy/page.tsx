"use client"

import { useEffect, useRef } from "react"
import "./_css/page.css"

function LedgerPage() {
    const ledgerPageRef = useRef(null)
    useEffect(() => {
        ledgerPageRef.current.classList.add("transitionOff")
    }, [])
    
    return (
        <div ref={ledgerPageRef} className="ledgerPage transitionOn w-screen h-full">
            <h1 className="font-bold text-4xl">Ledger</h1>
        </div>
    )
}

export default LedgerPage