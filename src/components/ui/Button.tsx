import React from "react";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

function Button({ children, type, className, disabled, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={`${
        className ? className : ""
      } inline-flex items-center justify-center rounded-sm bg-zinc-700 px-5 py-3 
      font-medium leading-none focus-within:bg-zinc-600 hover:bg-zinc-600
       focus:bg-zinc-600 focus:shadow-[0_0_0_2px] focus:shadow-neutral-400  `}
    >
      {children}
    </button>
  );
}

export default Button;
