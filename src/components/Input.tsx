import React, { ChangeEvent, Dispatch } from "react";

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
}) {
  return (
    <div
      className={
        props.className +
        " w-full rounded-sm bg-zinc-700 p-1 focus-within:bg-zinc-600  hover:bg-zinc-600  md:p-2 "
      }
    >
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
        className="thing w-full border-none bg-transparent outline-none placeholder:text-sm placeholder:italic  "
      />
    </div>
  );
}
export default Input;
