// share-utils.js — Web Share API with download fallback
// On mobile (iOS/Android) opens native share sheet (Instagram Stories, WhatsApp, etc.)
// On desktop falls back to file download

async function shareOrDownload(canvas, filename, shareText) {
  const dataUrl = canvas.toDataURL('image/png');

  if (navigator.share && navigator.canShare) {
    try {
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], filename, { type: 'image/png' });
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], text: shareText || '' });
        return 'shared';
      }
    } catch (e) {
      if (e.name === 'AbortError') return 'cancelled';
      // share failed — fall through to download
    }
  }

  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  link.click();
  return 'downloaded';
}
