import { Pressable, Text, GestureResponderEvent } from "react-native";
import clsx from "clsx";

type ButtonProps = {
  title: string;
  onPress?: (event: GestureResponderEvent) => void;
  className?: string;
  textClassName?: string;
  disabled?: boolean;
};

export default function HelpButton(props: ButtonProps) {
  const { title, onPress, className, textClassName, disabled } = {
    className: "",
    textClassName: "",
    disabled: false,
    ...props,
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={clsx(
        "bg-brand-dark-blue w-fit items-center py-4 px-4 rounded-md active:bg-active-brand-dark-blue self-start",
        disabled && "opacity-50",
        className
      )}
    >
      <Text
        className={clsx(
          "text-white font-bold text-center text-xl",
          textClassName
        )}
      >
        {title}
      </Text>
    </Pressable>
  );
}
