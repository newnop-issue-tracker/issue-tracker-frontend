import React from "react";
import classNames from "classnames";

interface Props {
  title: string;
  variant?: "primary" | "outline";
  fitWidth?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
}

const CustomButton = ({
  title,
  variant = "primary",
  fitWidth = false,
  type = "button",
  onClick,
  icon,
  iconPosition = "right",
  isLoading,
  className,
}: Props) => {
  const buttonClasses = classNames(
    "flex items-center justify-center px-6 py-3 text-sm font-medium transition-colors rounded-md",
    className,
    {
      "bg-brand-navy text-brand-white hover:bg-brand-charcoal":
        variant === "primary",
      "border border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-white":
        variant === "outline",
      "w-fit": fitWidth,
      "w-full": !fitWidth,
      "opacity-50 cursor-not-allowed": isLoading,
    }
  );

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isLoading}
      className={buttonClasses}
    >
      {icon && iconPosition === "left" && <span className="mr-2">{icon}</span>}
      {!isLoading ? title : "Loading..."}
      {icon && iconPosition === "right" && <span className="ml-2">{icon}</span>}
    </button>
  );
};

export default CustomButton;

// Dashboard button — used by authenticated app pages
import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md';

interface DashButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  children?: ReactNode;
}

export function Button({
  variant = 'secondary',
  size = 'md',
  icon,
  children,
  className = '',
  ...rest
}: DashButtonProps) {
  const classes = [
    'btn',
    `btn-${variant}`,
    size === 'sm' ? 'btn-sm' : '',
    icon && !children ? 'btn-icon' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classes} {...rest}>
      {icon}
      {children}
    </button>
  );
}
