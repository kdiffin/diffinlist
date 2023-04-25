import React, { ChangeEvent, Dispatch, ReactNode } from "react";

//straight up copy pasted from diffin chat LOL
function Input(props: {
  placeholder: string;
  type: string;
  value: string | undefined;
  onChange: Dispatch<React.SetStateAction<string>>;
  className?: string;
  defaultValue?: string;
  name?: string;
  id?: string;
  customFunction?: boolean;
  icon?: ReactNode;
}) {
  return (
    <div
      className={
        props.className +
        " flex w-full items-center  gap-2 rounded-sm bg-zinc-700 p-1 focus-within:bg-zinc-600 focus-within:shadow-[0_0_0_2px] focus-within:shadow-neutral-500  hover:bg-zinc-600  md:p-2 "
      }
    >
      {props.icon ? props.icon : null}
      <input
        value={props.value}
        type={props.type}
        onChange={(e) => props.onChange(e.target.value)}
        autoComplete="off"
        id={props.id}
        defaultValue={props.defaultValue}
        spellCheck="false"
        name={props.name}
        placeholder={props.placeholder}
        className={`flex w-full items-center justify-center  border-none bg-transparent outline-none placeholder:text-sm placeholder:italic`}
      />
    </div>
  );
}
export default Input;
