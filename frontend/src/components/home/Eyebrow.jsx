export default function Eyebrow({ children = "WELCOME TO BOOKWISE" }) {
  return (
    <p className="text-xs font-extrabold uppercase tracking-widest text-orange-500">
      {children}
    </p>
  );
}