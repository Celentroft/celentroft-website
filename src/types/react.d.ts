import "react";

declare module "react" {
  interface HTMLAttributes<T> {
    className?: string | undefined;
  }
}
