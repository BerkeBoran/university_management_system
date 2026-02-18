import React from "react";

const Button = ({
    onClick,
    children,
    type="button",
    disabled = false,
    variant="primary",
    className="",
    ...props
}) =>{
    const base_style =  "flex w-full items-center justify-center px-5 py-2.5 rounded-xl font-bold transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100";


    const variants = {
        primary: "relative px-4 py-2.5 transition-all ease-in duration-75 bg-neutral-primary-soft rounded-base group-hover:bg-transparent group-hover:dark:bg-transparent leading-5",
        secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200",
        danger: "bg-red-600 text-white hover:bg-red-700",
        outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
    };
    return(
     <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      {...props}
      className={`${base_style} ${variants[variant]} w-full ${className}`}
    >
      {children}
    </button>
  );


 };
export default Button;