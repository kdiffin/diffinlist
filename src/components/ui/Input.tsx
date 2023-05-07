import React, {
  ChangeEvent,
  Dispatch,
  InputHTMLAttributes,
  ReactNode,
  SetStateAction,
  forwardRef,
} from "react";

function Input(props: InputProps) {
  return (
    <div
      className={
        props.className +
        " flex w-full items-center  gap-2 rounded-sm bg-zinc-700 p-2 focus-within:bg-zinc-600 focus-within:shadow-[0_0_0_2px] focus-within:shadow-neutral-500  hover:bg-zinc-600  "
      }
    >
      {props.icon ? props.icon : null}
      <input
        value={props.value || ""}
        type={props.type}
        onChange={(e) => props.setValue(e.target.value)}
        autoComplete="off"
        id={props.id}
        spellCheck="false"
        name={props.name}
        placeholder={props.placeholder}
        className={`flex w-full items-center justify-center  border-none bg-transparent outline-none placeholder:text-sm placeholder:italic`}
      />
    </div>
  );
}

export function InputField({
  setValue,
  autoComplete,
  id,
  spellCheck,
  value,
  type,
  className,
  name,
  placeholder,
}: InputFieldProps) {
  return (
    <fieldset className={` ${className} mb-6 flex items-center gap-5`}>
      <label className=" w-[90px]  text-right text-[15px]" htmlFor={name}>
        {name}
      </label>

      <Input
        setValue={setValue}
        type={type}
        name={name}
        id={name}
        value={value}
        placeholder={placeholder}
      />
    </fieldset>
  );
}

//first time learning forwardRef, pretty useful for having non laggy inputs.
//https://react.dev/reference/react/forwardRef

export const RefInput = forwardRef(
  (
    {
      className,
      icon,
      value,
      type,
      setValue,
      id,
      name,
      max,
      min,
      maxLength,
      placeholder,
    }: RefInputProps,
    ref: React.Ref<HTMLInputElement>
  ) => {
    return (
      <div
        className={
          className +
          " flex w-full items-center  gap-2 rounded-sm bg-zinc-700 p-2 focus-within:bg-zinc-600 focus-within:shadow-[0_0_0_2px] focus-within:shadow-neutral-500  hover:bg-zinc-600  "
        }
      >
        {icon ? icon : null}
        <input
          type={type}
          onChange={(e) => setValue && setValue(e.target.value)}
          autoComplete="off"
          id={id}
          maxLength={maxLength}
          max={max}
          min={min}
          ref={ref}
          spellCheck="false"
          name={name}
          placeholder={placeholder}
          className={`flex w-full items-center justify-center  border-none bg-transparent outline-none placeholder:text-sm placeholder:italic`}
        />
      </div>
    );
  }
);

export const RefInputField = forwardRef(
  (
    { className, value, type, setValue, name, placeholder }: RefInputProps,
    ref: React.Ref<HTMLInputElement>
  ) => {
    return (
      <fieldset className={` ${className} mb-6 flex items-center gap-5`}>
        <label className=" w-[90px]  text-right text-[15px]" htmlFor={name}>
          {name}
        </label>

        <RefInput
          setValue={setValue}
          type={type}
          ref={ref}
          name={name}
          id={name}
          value={value}
          placeholder={placeholder}
        />
      </fieldset>
    );
  }
);

type InputFieldProps = Omit<InputProps, "icon">;

interface RefInputProps extends Omit<InputProps, "setValue"> {
  setValue?: Function | Dispatch<React.SetStateAction<string>>;
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  //naming this onchange results in an error
  setValue: Function | Dispatch<React.SetStateAction<string>>;
  customFunction?: boolean;
  icon?: ReactNode;
}

export default Input;
