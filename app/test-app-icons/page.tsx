'use client';

export default function TestAppIconsPage() {
  const icons = [
    { src: '/brand/icon-512.png', label: 'icon-512', desc: 'Android / PWA' },
    { src: '/brand/icon-maskable-512.png', label: 'maskable-512', desc: 'Android adaptive' },
    { src: '/brand/icon-192.png', label: 'icon-192', desc: 'Small PWA' },
    { src: '/brand/icon-maskable-192.png', label: 'maskable-192', desc: 'Small adaptive' },
    { src: '/brand/apple-touch-icon.png', label: 'apple-touch-icon', desc: 'iOS home screen' },
  ];

  return (
    <div className="h-full overflow-auto bg-chess-page">
      <div className="max-w-lg mx-auto w-full p-4 pb-32 space-y-6">
        <h1 className="text-xl font-bold text-chess-text">App Icon Audit</h1>
        <p className="text-sm text-chess-text-muted">
          Each icon shown at 256px with crosshair overlay to check centering.
        </p>

        {/* All icons with centering guides */}
        {icons.map((icon) => (
          <div key={icon.label} className="space-y-2">
            <div className="flex items-baseline gap-2">
              <h2 className="text-sm font-semibold text-chess-text">{icon.label}</h2>
              <span className="text-xs text-chess-text-faint">{icon.desc}</span>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col items-center gap-4">
              {/* Icon with crosshair overlay */}
              <div className="relative" style={{ width: 256, height: 256 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={icon.src}
                  alt={icon.label}
                  width={256}
                  height={256}
                  className="rounded-2xl"
                />
                {/* Vertical center line */}
                <div className="absolute top-0 left-1/2 w-px h-full bg-red-500 opacity-50" />
                {/* Horizontal center line */}
                <div className="absolute top-1/2 left-0 w-full h-px bg-red-500 opacity-50" />
                {/* Center dot */}
                <div className="absolute top-1/2 left-1/2 w-2 h-2 -mt-1 -ml-1 bg-red-500 rounded-full opacity-70" />
              </div>
            </div>
          </div>
        ))}

        {/* Simulated home screen icons */}
        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-chess-text">Simulated Home Screen</h2>
          <p className="text-xs text-chess-text-faint">How the icon looks at actual app-icon sizes</p>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-end justify-center gap-6">
              {/* iOS style */}
              <div className="text-center space-y-1">
                <div className="relative mx-auto" style={{ width: 60, height: 60 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/brand/apple-touch-icon.png"
                    alt="iOS"
                    width={60}
                    height={60}
                    className="rounded-[13px]"
                  />
                </div>
                <p className="text-[10px] text-chess-text">Chess Path</p>
                <p className="text-[9px] text-chess-text-faint">iOS 60px</p>
              </div>
              {/* Android circle mask */}
              <div className="text-center space-y-1">
                <div className="relative mx-auto overflow-hidden rounded-full" style={{ width: 60, height: 60 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/brand/icon-maskable-512.png"
                    alt="Android circle"
                    width={60}
                    height={60}
                  />
                </div>
                <p className="text-[10px] text-chess-text">Chess Path</p>
                <p className="text-[9px] text-chess-text-faint">Android circle</p>
              </div>
              {/* Android squircle mask */}
              <div className="text-center space-y-1">
                <div className="relative mx-auto overflow-hidden" style={{ width: 60, height: 60, borderRadius: '22%' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/brand/icon-maskable-512.png"
                    alt="Android squircle"
                    width={60}
                    height={60}
                  />
                </div>
                <p className="text-[10px] text-chess-text">Chess Path</p>
                <p className="text-[9px] text-chess-text-faint">Android squircle</p>
              </div>
              {/* Android rounded square */}
              <div className="text-center space-y-1">
                <div className="relative mx-auto overflow-hidden rounded-xl" style={{ width: 60, height: 60 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/brand/icon-maskable-512.png"
                    alt="Android rounded"
                    width={60}
                    height={60}
                  />
                </div>
                <p className="text-[10px] text-chess-text">Chess Path</p>
                <p className="text-[9px] text-chess-text-faint">Android rounded</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
