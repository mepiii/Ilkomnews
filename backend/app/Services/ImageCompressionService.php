<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class ImageCompressionService
{
    const MAX_WIDTH = 1920;
    const WEBP_QUALITY = 80;

    public function compress(UploadedFile $file, string $directory): string
    {
        $originalPath = $file->store($directory, 'public');
        $fullPath = Storage::disk('public')->path($originalPath);

        $imageInfo = @getimagesize($fullPath);
        if ($imageInfo === false) {
            return $originalPath;
        }

        [$width, $height, $type] = $imageInfo;

        if ($width <= self::MAX_WIDTH) {
            return $originalPath;
        }

        $newWidth = self::MAX_WIDTH;
        $newHeight = (int) round($height * ($newWidth / $width));

        $source = match ($type) {
            IMAGETYPE_JPEG => imagecreatefromjpeg($fullPath),
            IMAGETYPE_PNG => imagecreatefrompng($fullPath),
            IMAGETYPE_GIF => imagecreatefromgif($fullPath),
            IMAGETYPE_WEBP => imagecreatefromwebp($fullPath),
            default => null,
        };

        if ($source === null) {
            return $originalPath;
        }

        $resized = imagecreatetruecolor($newWidth, $newHeight);
        if ($type === IMAGETYPE_PNG || $type === IMAGETYPE_GIF) {
            imagealphablending($resized, false);
            imagesavealpha($resized, true);
        }

        imagecopyresampled($resized, $source, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);

        $webpPath = preg_replace('/\.(jpg|jpeg|png|gif)$/i', '.webp', $fullPath);
        imagewebp($resized, $webpPath, self::WEBP_QUALITY);

        imagedestroy($source);
        imagedestroy($resized);

        // Delete original if different format
        if ($webpPath !== $fullPath) {
            Storage::disk('public')->delete($originalPath);
        }

        return str_replace(Storage::disk('public')->path(''), '', $webpPath);
    }
}
