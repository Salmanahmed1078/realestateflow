
// Utility functions for animations

/**
 * Initialize scroll reveal animations
 * This function adds a scroll event listener that adds the 'active' class
 * to elements with the 'reveal' class when they enter the viewport
 */
export const initScrollReveal = () => {
  // Only run on client
  if (typeof window === 'undefined') return;

  const revealElements = document.querySelectorAll('.reveal');
  
  const checkReveal = () => {
    for (let i = 0; i < revealElements.length; i++) {
      const windowHeight = window.innerHeight;
      const elementTop = revealElements[i].getBoundingClientRect().top;
      const elementVisible = 150;
      
      if (elementTop < windowHeight - elementVisible) {
        revealElements[i].classList.add('active');
      } else {
        revealElements[i].classList.remove('active');
      }
    }
  };

  // Initial check
  checkReveal();
  
  // Add scroll event listener
  window.addEventListener('scroll', checkReveal);
  
  // Clean up function to remove event listener
  return () => {
    window.removeEventListener('scroll', checkReveal);
  };
};

/**
 * Add a class to an element after a delay
 * @param elementRef React ref to the element
 * @param className Class to add
 * @param delay Delay in milliseconds
 */
export const addClassWithDelay = (
  elementRef: React.RefObject<HTMLElement>,
  className: string,
  delay: number
) => {
  if (!elementRef.current) return;
  
  setTimeout(() => {
    elementRef.current?.classList.add(className);
  }, delay);
};

/**
 * Staggered animation for children elements
 * @param parentSelector Parent element selector
 * @param childSelector Child elements selector
 * @param staggerClass Class to add to children
 * @param staggerDelay Delay between each child animation
 */
export const staggerChildren = (
  parentSelector: string,
  childSelector: string,
  staggerClass: string,
  staggerDelay: number = 100
) => {
  const parent = document.querySelector(parentSelector);
  if (!parent) return;
  
  const children = parent.querySelectorAll(childSelector);
  
  children.forEach((child, index) => {
    setTimeout(() => {
      child.classList.add(staggerClass);
    }, index * staggerDelay);
  });
};
