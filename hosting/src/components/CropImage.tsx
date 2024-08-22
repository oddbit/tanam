import React, { useEffect, useRef, useState } from 'react';
import ReactCrop, { centerCrop, Crop, makeAspectCrop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

// Props interface for the CropImage component
export interface CropImageProps {
  src?: string; // URL or path of the image to be cropped
  onCropComplete?: (croppedImageUrl: string) => void; // Callback to handle the cropped image URL
  contentType?: string; // The content type for the output image, e.g., 'image/jpeg' or 'image/png'
}

/**
 * CropImage component allows users to crop an image and get the resulting cropped image data.
 * @param {CropImageProps} props - Props for the CropImage component.
 * @returns {JSX.Element | null} - The rendered CropImage component.
 */
export function CropImage(props: CropImageProps): JSX.Element | null {
  if (!props.src) return null;

  const { src, onCropComplete, contentType = 'image/jpeg' } = props;

  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null); // State to store the completed crop
  const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null); // State to store the cropped image URL
  const imageRef = useRef<HTMLImageElement | null>(null); // Ref to hold the reference to the image element
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null); // Ref to hold the reference to the canvas element

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
    const { naturalWidth: width, naturalHeight: height } = e.currentTarget;

    // Create a crop with a 16:9 aspect ratio, centered on the image
    const crop = centerCrop(
      makeAspectCrop(
        {
          // Initial crop dimensions and aspect ratio
          unit: '%',
          width: 90,
        },
        16 / 9,
        width,
        height
      ),
      width,
      height
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
    contentType: string
  ) {
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

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
        crop.height
      );

      // Convert the canvas content to a data URL with the specified content type
      const croppedImageUrl = canvas.toDataURL(contentType);
      setCroppedImageUrl(croppedImageUrl); // Save the cropped image URL in state

      if (onCropComplete) {
        onCropComplete(croppedImageUrl); // Trigger the callback with the cropped image URL
      }
    }
  }

  return (
    <div>
      <ReactCrop
        crop={crop} // Crop area managed by state
        onChange={(newCrop) => setCrop(newCrop)} // Update crop state when crop area changes
        onComplete={onCropCompleteInternal} // Callback triggered when cropping is completed
      >
        <img
          src={src} // Source image to be cropped
          alt="Source image crop"
          ref={imageRef} // Ref to hold the image element
          onLoad={onImageLoad} // Callback when the image is loaded
        />
      </ReactCrop>
      <canvas
        ref={previewCanvasRef}
        style={{
          display: 'none', // Canvas is hidden, used only for generating the cropped image
        }}
      />
      {croppedImageUrl && (
        <div>
          <h3>Preview:</h3>
          <img alt="Crop preview" src={croppedImageUrl} /> {/* Display the cropped image preview */}
        </div>
      )}
    </div>
  );
}
