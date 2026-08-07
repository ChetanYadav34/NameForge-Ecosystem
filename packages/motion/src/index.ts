import tokens from '@lexforge/design-tokens/dist/tokens.json';

export const spring = {
  snappy: {
    type: "spring",
    stiffness: tokens.motion.springs.snappy.stiffness,
    damping: tokens.motion.springs.snappy.damping,
    mass: tokens.motion.springs.snappy.mass,
  },
  fluid: {
    type: "spring",
    stiffness: tokens.motion.springs.fluid.stiffness,
    damping: tokens.motion.springs.fluid.damping,
    mass: tokens.motion.springs.fluid.mass,
  },
  reveal: {
    type: "spring",
    stiffness: tokens.motion.springs.reveal.stiffness,
    damping: tokens.motion.springs.reveal.damping,
    mass: tokens.motion.springs.reveal.mass,
  }
};

export const presets = {
  hover: {
    scale: 1.02,
    transition: spring.snappy
  },
  press: {
    scale: 0.98,
    transition: spring.snappy
  },
  focus: {
    scale: 1.01,
    boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.2)",
    transition: spring.snappy
  },
  reveal: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: spring.reveal
  },
  list: {
    container: {
      hidden: { opacity: 0 },
      show: {
        opacity: 1,
        transition: { staggerChildren: 0.05 }
      }
    },
    item: {
      hidden: { opacity: 0, x: -10 },
      show: { opacity: 1, x: 0, transition: spring.fluid }
    }
  },
  modal: {
    initial: { opacity: 0, scale: 0.95, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: -20 },
    transition: spring.fluid
  },
  commandPalette: {
    initial: { opacity: 0, scale: 0.98, y: -10 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.98, y: -10 },
    transition: spring.snappy
  },
  dock: {
    initial: { opacity: 0, y: '100%' },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: '100%' },
    transition: spring.fluid
  }
};
