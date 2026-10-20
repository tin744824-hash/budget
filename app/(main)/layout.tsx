"use client"

import NavBar from "../_components/NavBar/NavBar";

export default function MainLayout({ children }: {children: React.ReactNode}) {

    return (
        <div className="w-screen h-screen overflow-hidden">
                <NavBar />
                <div className="py-6 pb-20 p-6 md:px-10 sm:px-6 w-screen h-full overflow-y-auto">
                    {children}
                </div>
        </div>
    );
}
