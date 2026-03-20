"use client";

import Button, { type ButtonProps as PrimitiveButtonProps } from "@/src/design-system/primitives/Button";

const variantMap = {
  primary: "brand",
  secondary: "secondary",
  accent: "crimson",
  outline: "outline",
  ghost: "ghost",
  link: "link",
  destructive: "destructive",
} as const;

export type ButtonProps = Omit<PrimitiveButtonProps, "variant"> & {
  variant?: keyof typeof variantMap;
};

export default function RestaurantButton(props: ButtonProps) {
  const { variant = "primary", ...rest } = props;
  return <Button variant={variantMap[variant]} {...rest} />;
}
