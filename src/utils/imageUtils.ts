export async function getCroppedImg(
  image: HTMLImageElement,
  crop: { x: number; y: number; width: number; height: number }
): Promise<Blob> {
  console.log("Starting image crop process");
  const canvas = document.createElement('canvas');
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  canvas.width = crop.width;
  canvas.height = crop.height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('No 2d context');
  }

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width,
    crop.height
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) throw new Error('Canvas is empty');
      console.log("Image cropped successfully", { blobSize: blob.size });
      resolve(blob);
    }, 'image/jpeg', 1);
  });
}