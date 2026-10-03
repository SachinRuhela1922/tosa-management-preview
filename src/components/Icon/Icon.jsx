const paths = {
  file: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8",
  wallet: "M1 4h22v16H1z M1 10h22",
  chart: "M18 20V10 M12 20V4 M6 20v-6",
  target: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",
  calendar: "M3 4h18v18H3z M16 2v4 M8 2v4 M3 10h18",
  help: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3 M12 17h.01",
  book: "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z",
  message: "M21 11.5a8.4 8.4 0 0 1-9 8.4 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7A8.4 8.4 0 0 1 12 3a8.5 8.5 0 0 1 9 8.5z",
  activity: "M22 12h-4l-3 9L9 3l-3 9H2",
  globe: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z M2 12h20 M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20z",
  search: "M11 3a8 8 0 1 0 0 16 8 8 0 0 0 0-16z M21 21l-4.3-4.3",
  arrow: "M5 12h14 M12 5l7 7-7 7",
  refresh: "M23 4v6h-6 M1 20v-6h6 M3.5 9a9 9 0 0 1 14.8-3.4L23 10 M1 14l4.7 4.4A9 9 0 0 0 20.5 15",
  close: "M18 6L6 18 M6 6l12 12",
  up: "M18 15l-6-6-6 6",
  down: "M6 9l6 6 6-6",
  check: "M20 6L9 17l-5-5",
};

const Icon = ({ name, size = 16 }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d={paths[name]} />
  </svg>
);

export default Icon;