import React, { useState } from 'react';
import { Download } from 'lucide-react';

export const HERALDIC_EAGLE_SVG_STRING = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="1024" height="1024">
  <defs>
    <linearGradient id="navyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1a2a4a" />
      <stop offset="100%" stop-color="#0f182c" />
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#b58d1c" />
      <stop offset="50%" stop-color="#e5c148" />
      <stop offset="100%" stop-color="#b58d1c" />
    </linearGradient>
  </defs>
  <circle cx="256" cy="256" r="244" fill="url(#navyGrad)" stroke="url(#goldGrad)" stroke-width="10" />
  <circle cx="256" cy="256" r="228" fill="none" stroke="#c9a227" stroke-width="2" stroke-dasharray="6 4" />
  <path d="M96 365 Q256 340 416 365 L396 392 Q256 375 116 392 Z" fill="#2e7d32" stroke="#1b5e20" stroke-width="2" />
  <circle cx="145" cy="374" r="6" fill="#f9a825" />
  <circle cx="185" cy="368" r="5" fill="#f9a825" />
  <circle cx="256" cy="364" r="7" fill="#f9a825" />
  <circle cx="327" cy="368" r="5" fill="#f9a825" />
  <circle cx="367" cy="374" r="6" fill="#f9a825" />
  <path d="M168 358 L142 290 L124 252 L112 220 L128 196 L152 184 L162 204 L148 222 L166 250 L188 232 L192 248 L174 275 L186 355 Z" fill="#ffffff" stroke="#d4d4d8" stroke-width="2.5" stroke-linejoin="round" />
  <path d="M344 358 L370 290 L388 252 L400 220 L384 196 L360 184 L350 204 L364 222 L346 250 L324 232 L320 248 L338 275 L326 355 Z" fill="#ffffff" stroke="#d4d4d8" stroke-width="2.5" stroke-linejoin="round" />
  <path d="M190 195 H322 V275 C322 325 256 358 256 358 C256 358 190 325 190 275 Z" fill="#1a1a1a" stroke="url(#goldGrad)" stroke-width="5" stroke-linejoin="round" />
  <path d="M195 202 L256 264 L317 202 M256 264 V352" fill="none" stroke="#ffffff" stroke-width="18" stroke-linecap="round" stroke-linejoin="round" />
  <rect x="212" y="180" width="88" height="12" rx="6" fill="#ffffff" stroke="#2e7d32" stroke-width="3" />
  <path d="M225 180 L235 192 M250 180 L260 192 M275 180 L285 192" stroke="#2e7d32" stroke-width="4" />
  <path d="M244 150 C205 110 140 96 108 112 C125 128 148 136 132 148 C156 154 176 152 162 164 C188 168 215 166 238 174 Z" fill="#b22222" stroke="#c9a227" stroke-width="2.5" />
  <path d="M268 150 C307 110 372 96 404 112 C387 128 364 136 380 148 C356 154 336 152 350 164 C324 168 297 166 274 174 Z" fill="#b22222" stroke="#c9a227" stroke-width="2.5" />
  <path d="M240 180 L236 142 C236 122 246 104 256 100 L272 106 L264 114 L274 128 L272 180 Z" fill="#b22222" stroke="#c9a227" stroke-width="2.5" />
  <polygon points="270,105 284,110 270,115" fill="#c9a227" />
  <circle cx="262" cy="108" r="2.2" fill="#ffffff" />
  <path d="M84 392 Q256 372 428 392 L414 434 Q256 414 98 434 Z" fill="url(#goldGrad)" stroke="#1a2a4a" stroke-width="3" />
  <text x="256" y="416" font-family="Playfair Display, Georgia, serif" font-size="22" font-weight="700" fill="#1a2a4a" text-anchor="middle" letter-spacing="2">B. B. BALE &amp; CO</text>
  <text x="256" y="458" font-family="Playfair Display, Georgia, serif" font-size="15" font-weight="600" fill="#c9a227" text-anchor="middle" letter-spacing="5">CHAMBERS</text>
</svg>`;

interface LogoProps {
  size?: number;
  customLogoUrl?: string;
  className?: string;
}

export const NigerianEagleLogo: React.FC<LogoProps> = ({
  size = 44,
  customLogoUrl,
  className = '',
}) => {
  if (customLogoUrl) {
    return (
      <img
        src={customLogoUrl}
        alt="B. B. BALE & CO CHAMBERS Heraldic Crest"
        referrerPolicy="no-referrer"
        style={{ width: size, height: size }}
        className={`object-contain shrink-0 ${className}`}
      />
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      width={size}
      height={size}
      className={`shrink-0 ${className}`}
      role="img"
      aria-label="Nigerian Court Eagle Crest — B. B. BALE & CO CHAMBERS"
    >
      <defs>
        <linearGradient id="navyGradComp" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1a2a4a" />
          <stop offset="100%" stopColor="#0f182c" />
        </linearGradient>
        <linearGradient id="goldGradComp" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#b58d1c" />
          <stop offset="50%" stopColor="#e5c148" />
          <stop offset="100%" stopColor="#b58d1c" />
        </linearGradient>
      </defs>
      <circle
        cx="256"
        cy="256"
        r="244"
        fill="url(#navyGradComp)"
        stroke="url(#goldGradComp)"
        strokeWidth="10"
      />
      <circle
        cx="256"
        cy="256"
        r="228"
        fill="none"
        stroke="#c9a227"
        strokeWidth="2"
        strokeDasharray="6 4"
      />
      {/* Green Grass Base & Yellow Costus Spectabilis Flowers */}
      <path
        d="M96 365 Q256 340 416 365 L396 392 Q256 375 116 392 Z"
        fill="#2e7d32"
        stroke="#1b5e20"
        strokeWidth="2"
      />
      <circle cx="145" cy="374" r="6" fill="#f9a825" />
      <circle cx="185" cy="368" r="5" fill="#f9a825" />
      <circle cx="256" cy="364" r="7" fill="#f9a825" />
      <circle cx="327" cy="368" r="5" fill="#f9a825" />
      <circle cx="367" cy="374" r="6" fill="#f9a825" />
      {/* Two White Horses (Dignity) */}
      <path
        d="M168 358 L142 290 L124 252 L112 220 L128 196 L152 184 L162 204 L148 222 L166 250 L188 232 L192 248 L174 275 L186 355 Z"
        fill="#ffffff"
        stroke="#d4d4d8"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M344 358 L370 290 L388 252 L400 220 L384 196 L360 184 L350 204 L364 222 L346 250 L324 232 L320 248 L338 275 L326 355 Z"
        fill="#ffffff"
        stroke="#d4d4d8"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Black Shield with Gold Rim & White Wavy Y (Niger & Benue Rivers) */}
      <path
        d="M190 195 H322 V275 C322 325 256 358 256 358 C256 358 190 325 190 275 Z"
        fill="#1a1a1a"
        stroke="url(#goldGradComp)"
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <path
        d="M195 202 L256 264 L317 202 M256 264 V352"
        fill="none"
        stroke="#ffffff"
        strokeWidth="18"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Torse */}
      <rect
        x="212"
        y="180"
        width="88"
        height="12"
        rx="6"
        fill="#ffffff"
        stroke="#2e7d32"
        strokeWidth="3"
      />
      <path
        d="M225 180 L235 192 M250 180 L260 192 M275 180 L285 192"
        stroke="#2e7d32"
        strokeWidth="4"
      />
      {/* Red Eagle with Spread Wings */}
      <path
        d="M244 150 C205 110 140 96 108 112 C125 128 148 136 132 148 C156 154 176 152 162 164 C188 168 215 166 238 174 Z"
        fill="#b22222"
        stroke="#c9a227"
        strokeWidth="2.5"
      />
      <path
        d="M268 150 C307 110 372 96 404 112 C387 128 364 136 380 148 C356 154 336 152 350 164 C324 168 297 166 274 174 Z"
        fill="#b22222"
        stroke="#c9a227"
        strokeWidth="2.5"
      />
      <path
        d="M240 180 L236 142 C236 122 246 104 256 100 L272 106 L264 114 L274 128 L272 180 Z"
        fill="#b22222"
        stroke="#c9a227"
        strokeWidth="2.5"
      />
      <polygon points="270,105 284,110 270,115" fill="#c9a227" />
      <circle cx="262" cy="108" r="2.2" fill="#ffffff" />
      {/* Heraldic Banner */}
      <path
        d="M84 392 Q256 372 428 392 L414 434 Q256 414 98 434 Z"
        fill="url(#goldGradComp)"
        stroke="#1a2a4a"
        strokeWidth="3"
      />
      <text
        x="256"
        y="416"
        fontFamily="Playfair Display, Georgia, serif"
        fontSize="22"
        fontWeight="700"
        fill="#1a2a4a"
        textAnchor="middle"
        letterSpacing="2"
      >
        B. B. BALE &amp; CO
      </text>
      <text
        x="256"
        y="458"
        fontFamily="Playfair Display, Georgia, serif"
        fontSize="15"
        fontWeight="600"
        fill="#c9a227"
        textAnchor="middle"
        letterSpacing="5"
      >
        CHAMBERS
      </text>
    </svg>
  );
};

const PNG_RESOLUTIONS = [32, 64, 128, 256, 512, 1024] as const;

export const LogoAssetExporter: React.FC = () => {
  const [exportStatus, setExportStatus] = useState<string>('');

  const downloadSvg = () => {
    const blob = new Blob([HERALDIC_EAGLE_SVG_STRING], {
      type: 'image/svg+xml;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bbbale-chambers-eagle-crest.svg';
    a.click();
    URL.revokeObjectURL(url);
    setExportStatus('Downloaded scalable SVG master crest.');
  };

  const downloadPng = (dimension: number, isFavicon = false) => {
    const svgBlob = new Blob([HERALDIC_EAGLE_SVG_STRING], {
      type: 'image/svg+xml;charset=utf-8',
    });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = dimension;
      canvas.height = dimension;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, dimension, dimension);
        canvas.toBlob((pngBlob) => {
          if (pngBlob) {
            const pngUrl = URL.createObjectURL(pngBlob);
            const a = document.createElement('a');
            a.href = pngUrl;
            a.download = isFavicon
              ? 'favicon.png'
              : `bbbale-chambers-logo-${dimension}px.png`;
            a.click();
            URL.revokeObjectURL(pngUrl);
            setExportStatus(
              isFavicon
                ? 'Downloaded 32x32 favicon.png.'
                : `Downloaded ${dimension}x${dimension}px PNG crest.`
            );
          }
        }, 'image/png');
      }
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  return (
    <div className="border border-stone-200 bg-white p-6 rounded-lg">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <NigerianEagleLogo size={88} />
          <div>
            <h3 className="text-lg font-serif-display font-bold text-[#1a2a4a]">
              Nigerian Court Eagle Heraldic Crest Assets
            </h3>
            <p className="text-sm text-[#5a5a5a] mt-1 max-w-xl">
              Red Eagle atop the Black Shield with White &ldquo;Y&rdquo; (Niger &amp; Benue
              Rivers), flanked by White Horses on Costus Spectabilis grass with the firm banner.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={downloadSvg}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-[#1a2a4a] text-white rounded hover:bg-[#121e36] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Download SVG
          </button>
          <button
            type="button"
            onClick={() => downloadPng(32, true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium border border-stone-300 text-[#1c1c1c] bg-white rounded hover:bg-stone-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Favicon
          </button>
          {PNG_RESOLUTIONS.map((px) => (
            <button
              key={px}
              type="button"
              onClick={() => downloadPng(px)}
              className="inline-flex items-center gap-1 px-2.5 py-2 text-xs font-mono-code border border-stone-300 text-[#1c1c1c] bg-white rounded hover:bg-stone-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {px}px PNG
            </button>
          ))}
        </div>
      </div>
      {exportStatus && (
        <p className="text-xs text-[#2e7d32] font-medium mt-3">{exportStatus}</p>
      )}
    </div>
  );
};
