import React, { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

const ThemeToggle = () => {
    
    const [theme, setTheme] = useState(
        localStorage.getItem("theme") ? localStorage.getItem("theme") : "light"
    );

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const handleToggle = (e) => {
        if (e.target.checked) {
            setTheme("dark");
        } else {
            setTheme("light");
        }
    };

    return (
        
        <label className="swap swap-rotate btn btn-ghost btn-circle">
            
           
            <input 
                type="checkbox" 
                onChange={handleToggle}
                
                checked={theme === "dark"} 
                className="hidden"
            />
            
            
            <FaSun className="swap-on h-5 w-5 fill-current text-yellow-400" />
            
            
            <FaMoon className="swap-off h-5 w-5 fill-current text-slate-600" />
            
        </label>
    );
};

export default ThemeToggle;