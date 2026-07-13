<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class AdminProfileController extends Controller
{
    const MAX_ADMIN_SLOTS = 12;

    /**
     * Get all admin users (limited to 12 slots)
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
     * Update admin password. Admins may reset ANOTHER admin's password
     * without supplying the current password; the current password is only
     * required (and verified) when changing your own account.
     */
    public function updatePassword(Request $request, $id)
    {
        $admin = User::where('is_admin', true)->findOrFail($id);

        $isSelf = $request->user()->id === $admin->id;

        // M: peer-admin password reset is a privileged, account-takeover-capable
        // action — require the acting admin's own current_password too (no silent
        // takeover of another admin). Audited below via AuditLog.
        $rules = [
            'password' => 'required|string|min:12|confirmed|regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/',
            'current_password' => 'required|string',
        ];

        $validated = $request->validate($rules, [
            'password.regex' => 'Password harus mengandung huruf besar, huruf kecil, angka, dan simbol.',
            'password.min' => 'Password minimal 12 karakter.',
        ]);

        if (!Hash::check($validated['current_password'], $request->user()->password)) {
            return response()->json([
                'message' => 'Password lama yang Anda masukkan salah!',
            ], 400);
        }

        $admin->update([
            'password' => Hash::make($validated['password']),
        ]);

        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => $isSelf ? 'update_own_password' : 'reset_admin_password',
            'entity_type' => 'user',
            'entity_id' => $admin->id,
            'details' => ['target_email' => $admin->email, 'self' => $isSelf],
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return response()->json([
            'message' => $isSelf ? 'Password berhasil diperbarui.' : 'Password admin berhasil direset.',
        ]);
    }

    /**
     * Create new admin (limited to 12 slots)
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

        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => 'create_admin',
            'entity_type' => 'user',
            'entity_id' => $admin->id,
            'details' => ['email' => $admin->email],
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
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

        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => 'delete_admin',
            'entity_type' => 'user',
            'entity_id' => $admin->id,
            'details' => ['email' => $admin->email],
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

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
