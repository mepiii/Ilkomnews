<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UploadController extends Controller
{
    private const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];
    private const ALLOWED_MIMES = [
        'image/jpeg',
        'image/png',
        'image/webp',
    ];
    private const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
    private const MAGIC_BYTES = [
        'ffd8ff' => 'image/jpeg',   // JPEG
        '89504e' => 'image/png',    // PNG (first 3 bytes)
        '524946' => 'image/webp',   // RIFF header (WebP)
    ];

    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|file',
        ]);

        $file = $request->file('file');

        // 1. Check extension
        $ext = strtolower($file->getClientOriginalExtension());
        if (!in_array($ext, self::ALLOWED_EXTENSIONS)) {
            return response()->json(['error' => 'Only JPG, PNG, and WebP files are allowed.'], 422);
        }

        // 2. Check MIME type
        $mime = $file->getMimeType();
        if (!in_array($mime, self::ALLOWED_MIMES)) {
            return response()->json(['error' => 'Invalid file type.'], 422);
        }

        // 3. Check magic bytes
        $handle = fopen($file->getRealPath(), 'rb');
        $bytes = bin2hex(fread($handle, 4));
        fclose($handle);

        $validMagic = false;
        foreach (self::MAGIC_BYTES as $magic => $expectedMime) {
            if (str_starts_with($bytes, $magic)) {
                $validMagic = true;
                break;
            }
        }
        if (!$validMagic) {
            return response()->json(['error' => 'File content does not match expected image format.'], 422);
        }

        // 4. Check file size
        if ($file->getSize() > self::MAX_SIZE) {
            return response()->json(['error' => 'File size exceeds 10 MB limit.'], 422);
        }

        // 5. Check for double extensions
        $originalName = $file->getClientOriginalName();
        $parts = explode('.', $originalName);
        if (count($parts) > 2) {
            // Check if any hidden extension is executable
            foreach ($parts as $part) {
                $lowerPart = strtolower($part);
                if (in_array($lowerPart, ['php', 'phtml', 'exe', 'sh', 'bat', 'cmd', 'js', 'html'])) {
                    return response()->json(['error' => 'Suspicious file name detected.'], 422);
                }
            }
        }

        // 6. Store with random name
        $filename = Str::random(32) . '.' . $ext;
        $path = $file->storeAs('uploads', $filename, 'public');

        return response()->json([
            'path' => $path,
            'url' => Storage::disk('public')->url($path),
            'filename' => $filename,
            'size' => $file->getSize(),
        ], 201);
    }
}
