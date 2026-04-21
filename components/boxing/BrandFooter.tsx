export function SheetHeader() {
  return (
    <div className="sheet-header flex items-center justify-between gap-4 px-5 pt-3 pb-2 border-b border-neutral-300">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/logo-horizontal-dark.svg"
        alt="Chess Path"
        style={{ height: '28px', width: 'auto' }}
      />
      <div className="flex-1 text-center">
        <h1 className="text-base font-extrabold tracking-tight text-black leading-tight">
          NYC Chessboxing Puzzles
        </h1>
        <p className="text-[10px] text-neutral-600 leading-tight mt-0.5">
          Powered by Chess Path
        </p>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/nyc-chessboxing-logo.png"
        alt="NYC Chessboxing"
        style={{ height: '40px', width: '40px', objectFit: 'contain' }}
      />
    </div>
  );
}
