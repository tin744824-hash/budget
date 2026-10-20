"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import Wave from 'react-wavify'

import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Field, FieldGroup, FieldContent, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"

import { DeleteIcon } from "@/components/ui/delete"

import jarSvg from '../../../public/svg/jar.svg'
import "./_css/page.css"

function LedgerPage() {
    return (
        <div className="pb-4">
            <h1 className="font-bold text-4xl">Allocations</h1>
            <p className="text-foreground/80 font-[500]">How this month's income is divided. <i>All changes apply to this month only.</i></p>
            <div className="w-full h-full mt-5 flex md:items-center flex-col md:flex-row sm:flex-col gap-10 sm:gap-6 md:gap-10">
                <Field className="max-w-100 min-w-70 md:w-[60%] sm:w-full">
                    <FieldLabel className=" text-base">Monthly income</FieldLabel>
                    <InputGroup className="h-12 mb-[-0.5rem]">
                        <InputGroupInput className="font-medium text-lg" defaultValue={0}></InputGroupInput>
                        <InputGroupAddon align="inline-start">$</InputGroupAddon>
                        <InputGroupAddon align="inline-end">SGD</InputGroupAddon>
                    </InputGroup>
                    <FieldDescription className="">The amount that lands in your account</FieldDescription>
                </Field>
                <Card className="p-0 py-5 flex items-center flex-row w-full max-w-175 min-h-40 border-dashed border-orange-400 border-1 ring-0 rounded-sm">
                    <p></p> {/* for padding */}
                    <div className="w-25 md:w-30">

                        {/* <Image className="z-[2] relative" alt="allocation jar" src={jarSvg}></Image> */}
                        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96" role="img" aria-label="Unallocated jar">
                            <defs>
                                <filter id="riso-grain" x="-5%" y="-5%" width="110%" height="110%">
                                <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="4" result="noise"/>
                                <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -4.2 3.55" result="holes"/>
                                <feComposite in="SourceGraphic" in2="holes" operator="in"/>
                                </filter>
                                <clipPath id="jar">
                                <path d="M24 30h48v48c0 5-4 8-8 8H32c-4 0-8-3-8-8z"/>
                                </clipPath>
                            </defs>
                            <foreignObject width={"100%"} height={"100%"}>
                                <Wave className="fill-orange-300 -translate-y-1" clipPath="url(#jar)" fill="something" options={{height:50, amplitude:2, speed:0.2, points:3}}/> {/* height 85-30 */}
                            </foreignObject>
                            <g transform="translate(0 -4.75)">
                                <g filter="url(#riso-grain)">
                                    <g clipPath="url(#jar)" transform="translate(1.8 1.3)" style={{mixBlendMode:"multiply"}}>
                                    <rect x="20" y="86" width="56" height="4" fill="#f77f00"/>
                                    </g>
                                    <path d="M24 30h48v48c0 5-4 8-8 8H32c-4 0-8-3-8-8z" fill="none" stroke="#003049" strokeWidth="3" strokeLinejoin="round"/>
                                    <rect x="21" y="18" width="54" height="11" rx="2" fill="#003049"/>
                                    <path d="M30 40v30" stroke="#003049" strokeWidth="2" strokeLinecap="round" opacity=".45"/>
                                </g>
                            </g>
                        </svg>
                    </div>
                    <div className="flex flex-col h-full">
                        <span className="mb-1 font-mono font-medium text-orange-600" >UNALLOCATED</span>
                        <h3 className="font-[800] text-4xl text-foreground font-mono">$315.00</h3>
                        <p className="text-foreground/70 mt-1">still untouched</p>
                    </div>
                </Card>
            </div>
            <Card className="mt-10 p-0 rounded-sm w-full [&>:not(:last-child)]:border-b gap-0">
                <div className="p-10 w-full md:gap-13 sm:gap-5 grid md:grid-cols-[2fr_8fr_2fr] md:grid-rows-1 sm:grid-rows-2 sm:grid-cols-2">
                    <div className="flex items-center truncate">
                        <h5 className="text-lg font-medium truncate">Rent</h5>
                    </div>
                    <div className="flex flex-col sm:order-1 md:order-0 gap-2 w-full sm:col-span-full md:col-span-1">
                        <Progress value={56} className="w-full"/>
                        <div className="flex justify-between">
                            <span>$334 spent so far this month</span>
                            <span>56%</span>
                        </div>
                    </div>
                    <div className="flex flex-row gap-3">
                        <InputGroup className="border-0 border-b-1 rounded-none rounded-t-sm shadow-none min-w-40">
                            <InputGroupInput className="font-medium border-0" placeholder={"0"} autoComplete="off"></InputGroupInput>
                            <InputGroupAddon align="inline-start">$</InputGroupAddon>
                            <InputGroupAddon align="inline-end">SGD</InputGroupAddon>
                        </InputGroup>
                        <Button variant="secondary" size="icon">
                            <DeleteIcon />
                        </Button>
                    </div>
                </div>
                <div className="justify-start p-10 w-full md:gap-13 sm:gap-5 grid md:grid-cols-[2fr_8fr_2fr] md:grid-rows-1 sm:grid-rows-2 sm:grid-cols-2">
                    <div className="flex items-center truncate">
                        <h5 className="text-lg font-medium truncate">Utilities asdfasfasfsafsasdfasdfsdfasdfsadfsdfasdfsadf</h5>
                    </div>
                    <div className="flex flex-col sm:order-1 md:order-0 gap-2 w-full sm:col-span-full md:col-span-1">
                        <Progress value={56} className="w-full"/>
                        <div className="flex justify-between">
                            <span>$334 spent so far this month</span>
                            <span>56%</span>
                        </div>
                    </div>
                    <div className="flex flex-row gap-3">
                        <InputGroup className="border-0 border-b-1 rounded-none rounded-t-sm shadow-none min-w-40">
                            <InputGroupInput className="font-medium border-0" placeholder={"0"} autoComplete="off"></InputGroupInput>
                            <InputGroupAddon align="inline-start">$</InputGroupAddon>
                            <InputGroupAddon align="inline-end">SGD</InputGroupAddon>
                        </InputGroup>
                        <Button variant="secondary" size="icon">
                            <DeleteIcon />
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    )
}

export default LedgerPage