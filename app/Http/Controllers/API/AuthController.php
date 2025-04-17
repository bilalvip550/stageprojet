<?php

namespace App\Http\Controllers\API;

use App\Models\Admin;
use App\Models\Division;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        // Validate the input
        $credentials = $request->validate([
            'username' => 'required|string',
            'password' => 'required|string'
        ]);
    
        // Check Admin table first
        $admin = Admin::where('username', $credentials['username'])->first();
        if ($admin) {
            // For now doing plain-text compare (see part C below for hashed passwords)
            if ($credentials['password'] === $admin->password) {
                return response()->json([
                    'message' => 'Admin login successful',
                    'user' => [
                        'username' => $admin->username,
                        'role' => 'admin'
                    ]
                ], 200);
            }
        }
    
        // Check Division table if admin not found
        $division = Division::where('division_responsable', $credentials['username'])->first();
        if ($division) {
            if ($credentials['password'] === $division->password) {
                return response()->json([
                    'message' => 'Division login successful',
                    'user' => [
                        'username' => $division->division_responsable,
                        'role' => 'division_responsable'
                    ]
                ], 200);
            }
        }
    
        // Return an error if credentials do not match
        return response()->json([
            'message' => 'Invalid credentials'
        ], 401);
    }
    

    // Optional: A method to securely rehash passwords (if you want to transition to bcrypt in the future)
    public function rehashPasswords()
    {
        // Rehash Admin passwords if necessary
        $admins = Admin::all();
        foreach ($admins as $admin) {
            // Check if the password is plain-text and rehash it (optional rehashing)
            if (!Hash::needsRehash($admin->password)) {
                $admin->password = bcrypt($admin->password); // Bcrypt the password
                $admin->save();
            }
        }

        // Rehash Division passwords if necessary
        $divisions = Division::all();
        foreach ($divisions as $division) {
            // Check if the password is plain-text and rehash it (optional rehashing)
            if (!Hash::needsRehash($division->password)) {
                $division->password = bcrypt($division->password); // Bcrypt the password
                $division->save();
            }
        }

        return response()->json([
            'message' => 'Passwords have been rehashed where needed.'
        ], 200);
    }
}
