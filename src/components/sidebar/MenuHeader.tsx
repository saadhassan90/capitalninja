export function MenuHeader() {
  return (
    <div className="flex items-center gap-3 p-4">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-accent">
        <img
          src="/lovable-uploads/f5a05f58-4b3d-4f7b-8f79-ce224a93999d.png"
          alt="CapitalNinja Logo"
          className="h-6 w-6"
        />
      </div>
      <span className="font-semibold text-lg">CapitalNinja</span>
    </div>
  );
}