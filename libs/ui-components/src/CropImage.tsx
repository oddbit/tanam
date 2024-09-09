import Image from "next/image";
import React, {useEffect, useRef, useState} from "react";
import ReactCrop, {centerCrop, Crop, makeAspectCrop, PixelCrop} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

export interface CropImageProps {
  src?: string;
  onCropComplete?: (croppedImageUrl: string) => void;
  contentType?: string;
}

/**
 * CropImage component allows users to crop an image and get the resulting cropped image data.
 * @param {CropImageProps} props - Props for the CropImage component.
 * @return {JSX.Element | null} - The rendered CropImage component.
 */
export function CropImage(props: CropImageProps): JSX.Element | null {
  if (!props.src) return null;

  const {src, onCropComplete, contentType = "image/jpeg"} = props;

  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Generate cropped image once the crop is complete and the crop area is valid
  useEffect(() => {
    if (completedCrop && imageRef.current && previewCanvasRef.current) {
      generateCroppedImage(imageRef.current, previewCanvasRef.current, completedCrop, contentType);
    }
  }, [completedCrop, contentType]);

  /**
   * Callback function triggered when the image is loaded.
   * Calculates and sets an initial crop based on the image dimensions.
   * @param {React.SyntheticEvent<HTMLImageElement>} e - The synthetic event containing the image data.
   */
  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>): void {
    const {naturalWidth: width, naturalHeight: height} = e.currentTarget;

    // Create a crop with a 16:9 aspect ratio, centered on the image
    const crop = centerCrop(
      makeAspectCrop(
        {
          // Initial crop dimensions and aspect ratio
          unit: "%",
          width: 90,
        },
        16 / 9,
        width,
        height,
      ),
      width,
      height,
    );

    setCrop(crop);
  }

  /**
   * Callback function triggered when the crop operation is completed.
   * Processes the cropped image area and generates a URL for the cropped image.
   * @param {PixelCrop} pixelCrop - The pixel values of the crop area.
   */
  function onCropCompleteInternal(pixelCrop: PixelCrop) {
    setCompletedCrop(pixelCrop);
  }

  /**
   * Draw the cropped image on a canvas element and generate a data URL.
   * @param {HTMLImageElement} image - The image element to be cropped.
   * @param {HTMLCanvasElement} canvas - The canvas element to draw the cropped image on.
   * @param {PixelCrop} crop - The crop area data.
   * @param {string} contentType - The content type for the output image.
   */
  function generateCroppedImage(
    image: HTMLImageElement,
    canvas: HTMLCanvasElement,
    crop: PixelCrop,
    contentType: string,
  ) {
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height,
      );

      // Convert the canvas content to a data URL with the specified content type
      const croppedImageUrl = canvas.toDataURL(contentType);
      setCroppedImageUrl(croppedImageUrl);

      if (onCropComplete) {
        onCropComplete(croppedImageUrl);
      }
    }
  }

  return (
    <div>
      <ReactCrop crop={crop} onChange={(newCrop) => setCrop(newCrop)} onComplete={onCropCompleteInternal}>
        <Image src={src} alt="Source image crop" width={1200} height={800} ref={imageRef} onLoad={onImageLoad} />
      </ReactCrop>
      <canvas
        ref={previewCanvasRef}
        style={{
          display: "none",
        }}
      />
      {croppedImageUrl && (
        <div>
          <h3>Preview:</h3>
          <Image alt="Crop preview" src={croppedImageUrl} width={1200} height={800} />
        </div>
      )}
    </div>
  );
}
