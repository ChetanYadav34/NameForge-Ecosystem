export * from '../design-tokens/motion';

export const MotionRegistry = {
  presets: {
    // These will be populated from design tokens or defined here as standard framer-motion variants
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 }
    },
    slideUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 20 }
    }
  }
};
