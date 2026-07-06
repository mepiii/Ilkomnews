<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class AdminProfileController extends Controller
{
    /**
     * Get all admin users
     */
    public function index()
    {
        $admins = User::where('is_admin', true)
            ->orderBy('id')
            ->get(['id', 'name', 'email', 'created_at', 'updated_at']);

        return response()->json($admins);
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
            'message' => 'Name updated successfully',
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
            'email_verified_at' => null, // Reset verification
        ]);

        return response()->json([
            'message' => 'Email updated successfully. Please verify the new email.',
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
            'password.regex' => 'Password must contain uppercase, lowercase, number, and special character.',
            'password.min' => 'Password must be at least 12 characters.',
        ]);

        // Verify current password
        if (!Hash::check($validated['current_password'], $admin->password)) {
            return response()->json([
                'errors' => ['current_password' => ['Current password is incorrect.']],
            ], 422);
        }

        $admin->update([
            'password' => Hash::make($validated['password']),
        ]);

        // Log out other sessions for this user
        \DB::table('sessions')->where('user_id', $admin->id)->delete();

        return response()->json([
            'message' => 'Password updated successfully. Please login again.',
        ]);
    }

    /**
     * Create new admin
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:12|confirmed|regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/',
        ], [
            'password.regex' => 'Password must contain uppercase, lowercase, number, and special character.',
            'password.min' => 'Password must be at least 12 characters.',
        ]);

        $admin = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'is_admin' => true,
            'email_verified_at' => now(),
        ]);

        return response()->json([
            'message' => 'Admin created successfully',
            'admin' => [
                'id' => $admin->id,
                'name' => $admin->name,
                'email' => $admin->email,
            ],
        ], 201);
    }

    /**
     * Delete admin (cannot delete self or last admin)
     */
    public function destroy(Request $request, $id)
    {
        $admin = User::where('is_admin', true)->findOrFail($id);

        // Prevent self-deletion
        if ($request->user()->id === $admin->id) {
            return response()->json([
                'message' => 'Cannot delete your own account.',
            ], 403);
        }

        // Prevent deleting last admin
        $adminCount = User::where('is_admin', true)->count();
        if ($adminCount <= 1) {
            return response()->json([
                'message' => 'Cannot delete the last admin account.',
            ], 403);
        }

        $admin->delete();

        return response()->json([
            'message' => 'Admin deleted successfully',
        ]);
    }
}
