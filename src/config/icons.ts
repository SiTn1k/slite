// Єдиний набір лінійних іконок 24x24, stroke=currentColor.
const paths: Record<string, string> = {
  drop: '<path d="M12 3c3.5 4.3 6 7.4 6 10.6A6 6 0 0 1 6 13.6C6 10.4 8.5 7.3 12 3z"/>',
  bolt: '<path d="M13 2.5 5 13.5h6l-1 8 8-11h-6z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5V5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8"/>',
  heater: '<rect x="6" y="2.5" width="12" height="15" rx="3.5"/><path d="M12 7v4M9 21.5h6M10 17.5v4M14 17.5v4"/>',
  bath: '<path d="M4 12h16v2a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z"/><path d="M6 12V6a2 2 0 0 1 4 0M7 19l-1 2M17 19l1 2"/>',
  sink: '<path d="M3 11h18v1a6 6 0 0 1-6 6H9a6 6 0 0 1-6-6z"/><path d="M12 11V5a2 2 0 0 1 2-2h2M12 18v3"/>',
  meter: '<circle cx="12" cy="12" r="9"/><path d="M12 12l3.5-3.5M12 5v1.5M8 16h8"/>',
  towel: '<path d="M6 3v18M18 3v18M6 6.5h12M6 11.5h12M6 16.5h12"/>',
  washer: '<rect x="4" y="3" width="16" height="18" rx="2.5"/><circle cx="12" cy="13" r="4.5"/><path d="M7.5 6.5h2"/>',
  radiator: '<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M8 6v12M12 6v12M16 6v12M3 9H1.5M22.5 9H21"/>',
  pipes: '<path d="M3 8h8a3 3 0 0 1 3 3v2a3 3 0 0 0 3 3h4M3 5.5v5M21 13.5v5"/>',
  floor: '<path d="M5 17c0-3 2-3 2-6s-2-3-2-6M11 17c0-3 2-3 2-6s-2-3-2-6M17 17c0-3 2-3 2-6s-2-3-2-6M3 21h18"/>',
  mixer: '<path d="M5 10V7a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v3M3 10h12M9 10v3"/><path d="M9 16c-1 1.2-1.5 2-1.5 2.8a1.5 1.5 0 0 0 3 0c0-.8-.5-1.6-1.5-2.8z"/>',
  wiring: '<path d="M3 17c4 0 4-10 9-10s5 10 9 10"/><circle cx="3" cy="17" r="1.5"/><circle cx="21" cy="17" r="1.5"/>',
  cable: '<path d="M4 6h5v12h6V6h5"/><circle cx="4" cy="6" r="1.5"/><circle cx="20" cy="6" r="1.5"/>',
  panel: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h3M8 12h3M8 16h3M14 8h2M14 12h2M14 16h2"/>',
  socket: '<rect x="3.5" y="3.5" width="17" height="17" rx="4"/><path d="M9.5 10v2M14.5 10v2M9 15.5c1.8 1.2 4.2 1.2 6 0"/>',
  wrench: '<path d="M14.5 6.5a4 4 0 0 0-5 5l-6 6a2 2 0 0 0 3 3l6-6a4 4 0 0 0 5-5l-2.5 2.5-2.5-.5-.5-2.5z"/>',
  solar: '<path d="M4 20l2-10h12l2 10z"/><path d="M5.2 15h13.6M9 10l-1 10M15 10l1 10M12 10v10"/>',
  plug: '<path d="M9 3v5M15 3v5M6 8h12v3a6 6 0 0 1-12 0zM12 17v4"/>',
  phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
  message: '<path d="M4 5h16v11H9l-5 4z"/>',
  check: '<path d="M4 12.5l5 5L20 6.5"/>',
  chevron: '<path d="M6 9l6 6 6-6"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
};

export function icon(name: string, size = 24): string {
  const body = paths[name];
  if (!body) throw new Error(`Unknown icon: ${name}`);
  return `<svg class="icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${body}</svg>`;
}
