import { Toaster } from 'sonner';

/**
 * Modern global toast host — navy/gold brand, single stack, no duplicates pile-up.
 */
const AppToaster = () => (
  <Toaster
    position="top-right"
    richColors
    closeButton
    expand={false}
    visibleToasts={3}
    gap={10}
    offset={16}
    toastOptions={{
      classNames: {
        toast:
          '!rounded-xl !border !border-[rgba(11,29,54,0.1)] !bg-white !text-[#0b1d36] !shadow-[0_10px_30px_rgba(11,29,54,0.12)] !font-medium',
        title: '!text-sm !font-semibold !text-[#0b1d36]',
        description: '!text-xs !text-[#5b6b7c]',
        success: '!border-l-4 !border-l-[#219653]',
        error: '!border-l-4 !border-l-[#D34053]',
        warning: '!border-l-4 !border-l-[#FFA70B]',
        info: '!border-l-4 !border-l-[#0b1d36]',
        loading: '!border-l-4 !border-l-[#d4af37]',
        closeButton:
          '!bg-white !border-[rgba(11,29,54,0.12)] !text-[#0b1d36] hover:!bg-[#f7f8fb]',
        actionButton: '!bg-[#0b1d36] !text-[#d4af37]',
        cancelButton: '!bg-[#f7f8fb] !text-[#0b1d36]',
      },
    }}
  />
);

export default AppToaster;
