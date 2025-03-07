/**
 * This is a development utility to find potential Router components in your codebase
 * 
 * To use, import this in your App.js temporarily and call it in a useEffect:
 * 
 * import { findNestedRouters } from './utils/findRouterComponents';
 * 
 * useEffect(() => {
 *   if (process.env.NODE_ENV === 'development') {
 *     findNestedRouters();
 *   }
 * }, []);
 */

export const findNestedRouters = () => {
  console.log('%c🔍 Scanning for potential nested Router components...', 'font-size: 14px; font-weight: bold; color: #3b82f6;');
  
  // Look for React Router components in the DOM
  const routerTypes = [
    'BrowserRouter',
    'HashRouter',
    'MemoryRouter',
    'NativeRouter',
    'Router',
    'StaticRouter'
  ];
  
  // Function to recursively check component names in React DevTools
  const checkComponentNames = (fiber) => {
    if (!fiber) return;
    
    // Check component type name
    const componentName = fiber.type && typeof fiber.type === 'function' 
      ? fiber.type.name
      : '';
    
    if (routerTypes.includes(componentName)) {
      // Get component file location from stack trace if possible
      let location = '';
      try {
        throw new Error();
      } catch (e) {
        if (e.stack) {
          const stackLines = e.stack.split('\n');
          // Try to find a line with the component name
          const fileLine = stackLines.find(line => line.includes(componentName));
          if (fileLine) {
            location = fileLine.trim();
          }
        }
      }
      
      console.log(
        `%c⚠️ Potential Router component found: ${componentName}${location ? `\n   at ${location}` : ''}`,
        'font-weight: bold; color: #ef4444;'
      );
    }
    
    // Check children
    if (fiber.child) {
      checkComponentNames(fiber.child);
    }
    
    // Check siblings
    if (fiber.sibling) {
      checkComponentNames(fiber.sibling);
    }
  };
  
  // Access React internals if available (development only)
  const root = document.getElementById('root');
  if (root && root._reactRootContainer && root._reactRootContainer._internalRoot) {
    const fiber = root._reactRootContainer._internalRoot.current;
    checkComponentNames(fiber);
  } else {
    console.log('Could not access React fiber tree. Is this running in development mode?');
  }
  
  console.log('%c✅ Router component scan complete. Check for warnings above.', 'font-size: 14px; font-weight: bold; color: #10b981;');
  console.log('%c💡 Tip: Make sure your React Router setup is correct:', 'font-size: 14px; color: #6366f1;');
  console.log('%c   - Use createBrowserRouter and RouterProvider at the app root', 'color: #6366f1;');
  console.log('%c   - Use Link, NavLink, navigate() inside components', 'color: #6366f1;');
  console.log('%c   - Don\'t wrap components in their own Router', 'color: #6366f1;');
};

export default findNestedRouters;
