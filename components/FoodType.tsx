// REACT
import { Pressable, Text, GestureResponderEvent } from 'react-native';
import { View } from 'react-native';
import { ReactNode } from 'react'; 

// FUNCTION
import clsx from 'clsx';

type ButtonHelpModalProps = {
  title: string;
  onPress?: (event: GestureResponderEvent) => void;
  className?: string;
  textClassName?: string;
  disabled?: boolean;
  children?: ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
};

export function HelpModal(props: ButtonHelpModalProps) {
  const { title, onPress, className, textClassName, disabled, children, isOpen, onClose } = {
    className: '',
    textClassName: '',
    disabled: false,
    ...props,
  };

  if (isOpen !== undefined) {
    return (
      <>
        {isOpen && (
          <View className="absolute inset-0 bg-black/50 justify-center items-center px-6 z-50">
            <View className="bg-white rounded-lg p-6 w-full max-w-md">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-xl font-bold">{title}</Text>
                <Pressable onPress={onClose} className="p-2">
                  <Text className="text-gray-500 text-lg">✕</Text>
                </Pressable>
              </View>
              {children}
            </View>
          </View>
        )}
      </>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={clsx(
        'active:bg-active-brand-green w-full items-center rounded-md bg-brand-green py-4',
        disabled && 'opacity-50',
        className
      )}>
      <Text className={clsx('text-center text-xl font-bold text-white', textClassName)}>
        {title}
      </Text>
    </Pressable>
  );
}

type ButtonHelpProps = {
  title: string;
  onPress?: (event: GestureResponderEvent) => void;
  className?: string;
  textClassName?: string;
  disabled?: boolean;
};

export function HelpButton(props: ButtonHelpProps) {
  const { title, onPress, className, textClassName, disabled } = {
    className: '',
    textClassName: '',
    disabled: false,
    ...props,
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={clsx(
        'w-fit items-center self-start rounded-md bg-brand-dark-blue px-4 py-4 active:bg-active-brand-dark-blue',
        disabled && 'opacity-50',
        className
      )}>
      <Text className={clsx('text-center text-xl font-bold text-white', textClassName)}>
        {title}
      </Text>
    </Pressable>
  );
}

type ButtonChoiceButtonProps = {
  title: string;
  onPress?: (event: GestureResponderEvent) => void;
  className?: string;
  textClassName?: string;
  disabled?: boolean;
};

export function ChoiceButton(props: ButtonChoiceButtonProps) {
  const { title, onPress, className, textClassName, disabled } = {
    className: '',
    textClassName: '',
    disabled: false,
    ...props,
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={clsx(
        'active:bg-active-brand-green w-full items-center rounded-md bg-brand-green py-4',
        disabled && 'opacity-50',
        className
      )}>
      <Text className={clsx('text-center text-xl font-bold text-white', textClassName)}>
        {title}
      </Text>
    </Pressable>
  );
}

type DividerProps = {
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'primary' | 'secondary' | 'dark' | 'light';
  my?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16;
  mx?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16;
};

const variantStyles = {
  default: 'bg-gray-200',
  primary: 'bg-primary-500',
  secondary: 'bg-secondary-500',
  dark: 'bg-gray-800',
  light: 'bg-gray-100',
};

export function Divider({
  className = '',
  orientation = 'horizontal',
  variant = 'default',
  my = 0,
  mx = 0,
}: DividerProps) {
  return (
    <View
      className={clsx(
        orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
        variantStyles[variant],
        my && `my-${my}`,
        mx && `mx-${mx}`,
        className
      )}
    />
  );
}