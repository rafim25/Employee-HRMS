/**
 * App-wide toast adapter (Sonner) with a react-hot-toast-compatible API.
 * Vite aliases `react-hot-toast` → this module so existing imports keep working.
 */
import { toast as sonnerToast } from 'sonner';

const DEFAULT_DURATION = 3200;

const withDefaults = (options = {}) => ({
  duration: DEFAULT_DURATION,
  ...options,
});

const toast = (message, options) =>
  sonnerToast(message, withDefaults(options));

toast.success = (message, options) =>
  sonnerToast.success(message, withDefaults(options));

toast.error = (message, options) =>
  sonnerToast.error(message, withDefaults({ duration: 4200, ...options }));

toast.loading = (message, options) =>
  sonnerToast.loading(message, withDefaults({ duration: Infinity, ...options }));

toast.info = (message, options) =>
  sonnerToast.info(message, withDefaults(options));

toast.warning = (message, options) =>
  sonnerToast.warning(message, withDefaults(options));

toast.message = (message, options) =>
  sonnerToast.message(message, withDefaults(options));

toast.dismiss = (id) => sonnerToast.dismiss(id);

toast.promise = (promise, messages, options) =>
  sonnerToast.promise(promise, messages, withDefaults(options));

toast.custom = (render, options) =>
  sonnerToast.custom(render, withDefaults(options));

export { toast };
export default toast;

// Compatibility for rare `import { Toaster } from 'react-hot-toast'`
// Prefer AppToaster in AuthContext; this is a safe no-op shell.
export const Toaster = () => null;
