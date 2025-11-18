import { Pressable, Text, GestureResponderEvent } from "react-native";
import clsx from "clsx";

type ButtonProps = {
  title: string;
  onPress?: (event: GestureResponderEvent) => void;
  className?: string;
  textClassName?: string;
  disabled?: boolean;
};

export default function Button(props: ButtonProps) {
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
        "bg-brand-green w-full items-center py-4 rounded-md active:bg-active-brand-green",
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
