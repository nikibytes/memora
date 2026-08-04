"use client"

import * as React from "react"
import { motion, AnimatePresence, type HTMLMotionProps } from "motion/react"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import type { VariantProps } from "class-variance-authority"

// Springy press & pop physics — shared so every interactive element feels the same.
const springTap = { type: "spring" as const, stiffness: 420, damping: 17, mass: 0.6 }

type MotionButtonProps = Omit<HTMLMotionProps<"button">, "ref"> &
  VariantProps<typeof buttonVariants> & {
    /** When set, clicking morphs the button into a compact loading pill for this many ms. */
    loadingText?: string
    /** Controlled pending state. When provided, overrides the internal auto timer. */
    pending?: boolean
    /** Auto-morph duration in ms when uncontrolled. Defaults to 1600. */
    morphDuration?: number
  }

/**
 * MotionButton — springy press & pop on every click, plus an optional
 * "loading morph" that collapses the button into a compact spinner pill.
 */
export const MotionButton = React.forwardRef<HTMLButtonElement, MotionButtonProps>(function MotionButton(
  { className, variant, size, children, loadingText, pending, morphDuration = 1600, onClick, disabled, ...props },
  ref,
) {
  const [internalPending, setInternalPending] = React.useState(false)
  const isPending = pending ?? internalPending
  const morphs = loadingText !== undefined

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    onClick?.(event)
    if (morphs && pending === undefined && !internalPending) {
      setInternalPending(true)
      window.setTimeout(() => setInternalPending(false), morphDuration)
    }
  }

  return (
    <motion.button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), "relative overflow-hidden", className)}
      // Springy press & pop
      whileHover={disabled ? undefined : { scale: 1.03 }}
      whileTap={disabled ? undefined : { scale: 0.94 }}
      transition={springTap}
      onClick={handleClick}
      disabled={disabled || (morphs && isPending)}
      aria-live={morphs ? "polite" : undefined}
      {...props}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {morphs && isPending ? (
          <motion.span
            key="loading"
            className="flex items-center gap-2"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={springTap}
          >
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            {loadingText}
          </motion.span>
        ) : (
          <motion.span
            key="label"
            className="flex items-center justify-center gap-2"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={springTap}
          >
            {children}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  )
})
