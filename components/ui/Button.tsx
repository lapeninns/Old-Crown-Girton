"use client";

import Button, { type ButtonProps as PrimitiveButtonProps } from "@/src/design-system/primitives/Button";

const variantMap = {
  primary: "accent",
  secondary: "secondary",
  outline: "outline",
  ghost: "ghost",
} as const;

export type ButtonProps = Omit<PrimitiveButtonProps, "variant"> & {
  variant?: keyof typeof variantMap;
};

export default function UIButton(props: ButtonProps) {
  const { variant = "primary", ...rest } = props;
  return <Button variant={variantMap[variant]} {...rest} />;
}
