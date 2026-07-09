<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class AdminProfileController extends Controller
{
    const MAX_ADMIN_SLOTS = 9;

    /**
     * Get all admin users (limited to 9 slots)
     */
    public function index()
    {
        $admins = User::where('is_admin', true)
            ->orderBy('id')
            ->get(['id', 'name', 'email', 'created_at', 'updated_at']);

        return response()->json([
            'admins' => $admins,
            'slots' => [
                'used' => $admins->count(),
                'max' => self::MAX_ADMIN_SLOTS,
                'available' => self::MAX_ADMIN_SLOTS - $admins->count(),
            ],
        ]);
    }

    /**
     * Get single admin profile
     */
    public function show($id)
    {
        $admin = User::where('is_admin', true)->findOrFail($id);

        return response()->json([
            'id' => $admin->id,
            'name' => $admin->name,
            'email' => $admin->email,
        ]);
    }

    /**
     * Update admin name only
     */
    public function updateName(Request $request, $id)
    {
        $admin = User::where('is_admin', true)->findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $admin->update(['name' => $validated['name']]);

        return response()->json([
            'message' => 'Nama berhasil diperbarui',
            'admin' => [
                'id' => $admin->id,
                'name' => $admin->name,
                'email' => $admin->email,
            ],
        ]);
    }

    /**
     * Update admin email only
     */
    public function updateEmail(Request $request, $id)
    {
        $admin = User::where('is_admin', true)->findOrFail($id);

        $validated = $request->validate([
            'email' => [
                'required',
                'email',
                Rule::unique('users')->ignore($id),
            ],
        ]);

        $admin->update([
            'email' => $validated['email'],
            'email_verified_at' => null,
        ]);

        return response()->json([
            'message' => 'Email berhasil diperbarui. Silakan verifikasi email baru.',
            'admin' => [
                'id' => $admin->id,
                'name' => $admin->name,
                'email' => $admin->email,
            ],
        ]);
    }

    /**
     * Update admin password only
     */
    public function updatePassword(Request $request, $id)
    {
        $admin = User::where('is_admin', true)->findOrFail($id);

        $validated = $request->validate([
            'current_password' => 'required|string',
            'password' => 'required|string|min:12|confirmed|regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/',
        ], [
            'password.regex' => 'Password harus mengandung huruf besar, huruf kecil, angka, dan simbol.',
            'password.min' => 'Password minimal 12 karakter.',
        ]);

        if (!Hash::check($validated['current_password'], $admin->password)) {
            return response()->json([
                'errors' => ['current_password' => ['Password saat ini tidak sesuai.']],
            ], 422);
        }

        $admin->update([
            'password' => Hash::make($validated['password']),
        ]);

        return response()->json([
            'message' => 'Password berhasil diperbarui.',
        ]);
    }

    /**
     * Create new admin (limited to 9 slots)
     */
    public function store(Request $request)
    {
        $currentCount = User::where('is_admin', true)->count();
        
        if ($currentCount >= self::MAX_ADMIN_SLOTS) {
            return response()->json([
                'message' => 'Slot admin penuh. Maksimal ' . self::MAX_ADMIN_SLOTS . ' admin.',
            ], 422);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:12|confirmed|regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/',
        ], [
            'password.regex' => 'Password harus mengandung huruf besar, huruf kecil, angka, dan simbol.',
            'password.min' => 'Password minimal 12 karakter.',
        ]);

        $admin = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'is_admin' => true,
            'email_verified_at' => now(),
        ]);

        return response()->json([
            'message' => 'Admin berhasil dibuat',
            'admin' => [
                'id' => $admin->id,
                'name' => $admin->name,
                'email' => $admin->email,
            ],
            'slots' => [
                'used' => $currentCount + 1,
                'max' => self::MAX_ADMIN_SLOTS,
                'available' => self::MAX_ADMIN_SLOTS - $currentCount - 1,
            ],
        ], 201);
    }

    /**
     * Delete admin (cannot delete self or if only one remains)
     */
    public function destroy(Request $request, $id)
    {
        $admin = User::where('is_admin', true)->findOrFail($id);

        if ($request->user()->id === $admin->id) {
            return response()->json([
                'message' => 'Tidak dapat menghapus akun sendiri.',
            ], 403);
        }

        $adminCount = User::where('is_admin', true)->count();
        if ($adminCount <= 1) {
            return response()->json([
                'message' => 'Tidak dapat menghapus admin terakhir.',
            ], 403);
        }

        $admin->delete();

        return response()->json([
            'message' => 'Admin berhasil dihapus',
            'slots' => [
                'used' => $adminCount - 1,
                'max' => self::MAX_ADMIN_SLOTS,
                'available' => self::MAX_ADMIN_SLOTS - $adminCount + 1,
            ],
        ]);
    }
}
