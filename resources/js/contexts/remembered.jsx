import React from "react";
import { useRemember } from "@inertiajs/inertia-react";


export default function dashParams () {
    const [dashState, setDashState] = useRemember({
        activeMenu: true,
        userProfile: false,
        screenSize: undefined,
    })
    return { dashState, setDashState }
}
export const themeParams = () => {
    const [themep, setThemep] = useRemember({
        currentColor: '#03C9D7',
        currentMode: 'Light',
        themeSettings: false,
    })

    const setMode = (value) => {
        setThemep(prevP => ({ ...prevP, currentMode: value }))
        localStorage.setItem('themeMode', value)
        setThemep(prevP => ({ ...prevP, themeSettings: false }))
    }

    const setColor = (value) => {
        setThemep(prevP => ({ ...prevP, currentColor: value }))
        localStorage.setItem('themeColor', value)
        setThemep(prevP => ({ ...prevP, themeSettings: false }))
    }

    return {themep, setThemep, setColor, setMode}
}