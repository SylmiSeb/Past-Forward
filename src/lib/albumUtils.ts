/**
 * Canvas utilities for exporting polaroid images and the full album page.
 */

const POLAROID_W = 800;
const POLAROID_H = 960;
const IMG_PADDING = 40;
const CAPTION_AREA = 160;

/**
 * Generates a single polaroid PNG (800×960) with the given image and caption.
 * Returns a data-URL (PNG).
 */
export async function createPolaroidImage(
  imageUrl: string,
  caption: string
): Promise<string> {
  const canvas = document.createElement('canvas');
  canvas.width = POLAROID_W;
  canvas.height = POLAROID_H;
  const ctx = canvas.getContext('2d')!;

  // White polaroid background
  ctx.fillStyle = '#FEFEFE';
  ctx.fillRect(0, 0, POLAROID_W, POLAROID_H);

  // Subtle shadow on image area
  ctx.shadowColor = 'rgba(0,0,0,0.12)';
  ctx.shadowBlur = 8;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;

  // Load and draw photo
  const img = await loadImage(imageUrl);
  const imgAreaH = POLAROID_H - CAPTION_AREA - IMG_PADDING * 2;
  ctx.drawImage(img, IMG_PADDING, IMG_PADDING, POLAROID_W - IMG_PADDING * 2, imgAreaH);

  // Reset shadow
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  // Caption
  ctx.fillStyle = '#333';
  ctx.font = `bold 52px "Permanent Marker", cursive`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const captionY = POLAROID_H - CAPTION_AREA / 2;
  ctx.fillText(caption, POLAROID_W / 2, captionY);

  return canvas.toDataURL('image/png');
}

/**
 * Generates a full album page (A4 at 300dpi = 2480×3508) with 6 polaroids
 * in a 2×3 grid, slightly tilted, on a parchment background.
 * Returns a data-URL (PNG).
 */
export async function createAlbumPage(
  images: Array<{ url: string; decade: string }>
): Promise<string> {
  const PAGE_W = 2480;
  const PAGE_H = 3508;

  const canvas = document.createElement('canvas');
  canvas.width = PAGE_W;
  canvas.height = PAGE_H;
  const ctx = canvas.getContext('2d')!;

  // Parchment background
  ctx.fillStyle = '#F5ECD7';
  ctx.fillRect(0, 0, PAGE_W, PAGE_H);

  // Subtle noise / texture
  for (let i = 0; i < 8000; i++) {
    const x = Math.random() * PAGE_W;
    const y = Math.random() * PAGE_H;
    const alpha = Math.random() * 0.04;
    ctx.fillStyle = `rgba(100,70,20,${alpha})`;
    ctx.fillRect(x, y, 2, 2);
  }

  // Title
  ctx.fillStyle = '#5C3D11';
  ctx.font = 'bold 120px "Permanent Marker", cursive';
  ctx.textAlign = 'center';
  ctx.fillText('Past Forward', PAGE_W / 2, 180);

  const COLS = 2;
  const ROWS = 3;
  const CARD_W = 800;
  const CARD_H = 960;
  const SCALE = 0.85;
  const CW = CARD_W * SCALE;
  const CH = CARD_H * SCALE;
  const H_GAP = (PAGE_W - COLS * CW) / (COLS + 1);
  const V_GAP = (PAGE_H - 280 - ROWS * CH) / (ROWS + 1);

  const angles = [-3, 2, -1.5, 3, -2.5, 1]; // slight random tilts per card

  for (let i = 0; i < Math.min(images.length, 6); i++) {
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    const cx = H_GAP + col * (CW + H_GAP) + CW / 2;
    const cy = 280 + V_GAP + row * (CH + V_GAP) + CH / 2;

    const angle = (angles[i] * Math.PI) / 180;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);

    // Drop shadow for polaroid
    ctx.shadowColor = 'rgba(0,0,0,0.25)';
    ctx.shadowBlur = 24;
    ctx.shadowOffsetX = 6;
    ctx.shadowOffsetY = 8;

    // White polaroid frame
    ctx.fillStyle = '#FEFEFE';
    ctx.fillRect(-CW / 2, -CH / 2, CW, CH);

    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // Photo
    const imgPad = 30 * SCALE;
    const captionArea = 130 * SCALE;
    const imgH = CH - imgPad * 2 - captionArea;

    const img = await loadImage(images[i].url);
    ctx.drawImage(img, -CW / 2 + imgPad, -CH / 2 + imgPad, CW - imgPad * 2, imgH);

    // Caption
    ctx.fillStyle = '#333';
    ctx.font = `bold ${44 * SCALE}px "Permanent Marker", cursive`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(images[i].decade, 0, CH / 2 - captionArea / 2);

    ctx.restore();
  }

  return canvas.toDataURL('image/png');
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
