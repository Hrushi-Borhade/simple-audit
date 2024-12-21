import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib";

// FIXME: Unable to add text-custom-base-white text-caption-accent to variants only 1 being applied.
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-lg ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 duration-300 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "",
        primary:
          "hover:bg-background-brand-hover bg-background-brand text-txt-onMenu disabled:bg-background-secondary",
        secondary:
          "bg-background-secondary text-txt-primary hover:bg-background-primary disabled:bg-background-primary border border-bodr-primary",
        destructive:
          "hover:bg-background-danger-hover bg-background-danger text-txt-onMenu",
        pro: "hover:bg-background-yellow-hover bg-background-yellow text-txt-primary",
        preview:
          "hover:bg-brand-blue bg-brand-blue-alpha border border-brand-blue-alpha text-txt-primary",
        link: "hover:underline bg-transparent text-txt-brand disabled:text-txt-tertiary",
        outline:
          "rounded-lg border border-bodr-primary bg-background-primary hover:bg-background-secondary  text-txt-primary",
        // Old states
        ghost:
          "rounded-m font-secondary hover:bg-neutral-200 hover:text-base-black"
      },
      size: {
        none: "",
        extraSmall: "p-1 rounded",
        small: "px-2 py-1",
        regular: "px-3 py-2",
        // Old states
        default: "",
        xs: "h-6 rounded-md px-3 text-xs",
        sm: "h-9 rounded-md px-3",
        md: "rounded-m py-s px-sm",
        lg: "h-11 rounded-md px-8",
        icon: "rounded-m h-6 w-6"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "regular"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
