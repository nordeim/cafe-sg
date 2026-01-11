<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        $role = Role::firstOrCreate(['name' => 'admin']);

        $user = User::firstOrCreate(
            ['email' => 'admin@merlionbrews.sg'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('password'), // In production, use env or prompt
            ]
        );

        if (!$user->hasRole('admin')) {
            $user->roles()->attach($role);
        }
    }
}