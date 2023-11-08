"use client"


import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useState,useEffect } from "react";

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])
  

  if (!mounted) {
    return null
  }

  return (
    <div>
      {theme === "dark" ? (
        <Sun size={25} cursor="pointer" onClick={()=> setTheme("light")}/>
      ):(
        <Moon size={25} cursor="pointer" onClick={()=> setTheme("dark")}/>
      )}
    </div>
  )
}
