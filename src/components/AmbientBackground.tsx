export default function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_8%,rgba(94,184,255,.075),transparent_30rem),radial-gradient(circle_at_100%_58%,rgba(29,78,216,.065),transparent_34rem)]" />
      <div className="absolute inset-0 bg-grid bg-[size:72px_72px] [mask-image:linear-gradient(to_bottom,black,transparent_34%)] opacity-40" />
    </div>
  );
}
