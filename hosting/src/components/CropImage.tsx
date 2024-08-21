import React, { useRef, useState } from 'react';
import ReactCrop, { Crop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

// Props interface for the CropImage component
interface ICropImageProps {
  src: string; // URL or path of the image to be cropped
  onCropComplete?: (croppedImageUrl: string) => void; // Callback to handle the cropped image URL
  contentType?: string; // The content type for the output image, e.g., 'image/jpeg' or 'image/png'
}

/**
 * CropImage component allows users to crop an image and get the resulting cropped image data.
 * @param {ICropImageProps} props - Props for the CropImage component.
 * @returns {JSX.Element} - The rendered CropImage component.
 */
export function CropImage(props: ICropImageProps) {
  const { src, onCropComplete, contentType = 'image/jpeg' } = props;
  
  const [crop, setCrop] = useState<Crop>({
    unit: '%', // Unit for crop dimensions: '%' or 'px'
    x: 25, // X position of the crop area
    y: 25, // Y position of the crop area
    width: 50, // Width of the crop area
    height: 50 // Height of the crop area
  }); 

  const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null); // State to store the cropped image URL
  const imageRef = useRef<HTMLImageElement | null>(null); // Ref to hold the reference to the image element

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
   * Callback function triggered when the crop area changes.
   * Updates the crop state with the new crop area.
   * @param {Crop} crop - The new crop area data.
   */
  function onCropChange(crop: Crop) {
    setCrop(crop);
  };

  /**
   * Callback function triggered when the crop operation is completed.
   * Processes the cropped image area and generates a URL for the cropped image.
   * @param {Crop} crop - The crop area data.
   * @param {object} pixelCrop - The pixel values of the crop area.
   */
  function onCropCompleteInternal(crop: Crop, pixelCrop: any) {
    if (imageRef.current && pixelCrop.width && pixelCrop.height) {
      const canvas = document.createElement('canvas'); // Create a canvas element to draw the cropped image
      const scaleX = imageRef.current.naturalWidth / imageRef.current.width; // Calculate horizontal scaling factor
      const scaleY = imageRef.current.naturalHeight / imageRef.current.height; // Calculate vertical scaling factor
      canvas.width = pixelCrop.width; // Set canvas width to the width of the crop area
      canvas.height = pixelCrop.height; // Set canvas height to the height of the crop area
      const ctx = canvas.getContext('2d'); // Get 2D context of the canvas

      if (ctx) {
        // Draw the cropped image on the canvas
        ctx.drawImage(
          imageRef.current,
          pixelCrop.x * scaleX, // X coordinate of the source image to start cropping
          pixelCrop.y * scaleY, // Y coordinate of the source image to start cropping
          pixelCrop.width * scaleX, // Width of the source image to crop
          pixelCrop.height * scaleY, // Height of the source image to crop
          0,
          0,
          pixelCrop.width,
          pixelCrop.height
        );

        // Convert the canvas content to a data URL with the specified content type
        const croppedImageUrl = canvas.toDataURL(contentType);
        setCroppedImageUrl(croppedImageUrl); // Save the cropped image URL in state
        if (onCropComplete) {
          onCropComplete(croppedImageUrl); // Trigger the callback with the cropped image URL
        }
      }
    }
  };

  return (
    <div>
      <ReactCrop
        crop={crop} // Crop area managed by state
        onChange={onCropChange} // Update crop state when crop area changes
        onComplete={onCropCompleteInternal} // Callback triggered when cropping is completed
      >
        <img
          src={src} // Source image to be cropped
          alt="Source image crop"
          ref={imageRef} // Ref to hold the image element
          onLoad={onImageLoad} // Callback when the image is loaded
        />
      </ReactCrop>
      {croppedImageUrl && (
        <div>
          <h3>Preview:</h3>
          <img alt="Crop preview" src={croppedImageUrl} /> {/* Display the cropped image preview */}
        </div>
      )}
    </div>
  );
}
