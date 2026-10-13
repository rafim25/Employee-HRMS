export const inputClass =
  'w-full rounded-xl border border-[rgba(11,29,54,0.12)] bg-white py-2.5 px-3 outline-none focus:border-[#d4af37]';

export const cardClass = 'app-card mb-6 p-4 md:p-6';

export const SectionTitle = ({ eyebrow, title, action }) => (
  <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
    <div>
      {eyebrow && (
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#d4af37]">
          {eyebrow}
        </p>
      )}
      <h3 className="text-xl font-semibold text-[#0b1d36]">{title}</h3>
    </div>
    {action}
  </div>
);

export const EmptyRow = ({ cols, text }) => (
  <tr>
    <td colSpan={cols} className="px-4 py-12 text-center text-sm text-[#5b6b7c]">
      {text}
    </td>
  </tr>
);

/** Shared table header / cell classes for pages still using raw <table>. */
export const thClass =
  'px-4 py-3.5 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-white/90';
export const tdClass = 'px-4 py-3.5 align-middle text-sm text-[#0b1d36]';
export const theadRowClass = 'bg-[#0b1d36] text-left';
export const tbodyRowClass =
  'border-t border-[rgba(11,29,54,0.06)] transition-colors hover:bg-[#f8f4e8]/70';

export const getGeo = () =>
  new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({});
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        }),
      () => resolve({}),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  });
