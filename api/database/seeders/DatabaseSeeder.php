<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Admin Cinema',
            'email' => 'admin@cineplex.com',
            'password' => bcrypt('password'),
            'role' => 'admin'
        ]);

        User::factory()->create([
            'name' => 'Kasir Cinema',
            'email' => 'kasir@cineplex.com',
            'password' => bcrypt('password'),
            'role' => 'kasir'
        ]);

        User::factory()->create([
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => bcrypt('password'),
            'role' => 'pelanggan'
        ]);

        // Create some movies
        \DB::table('movies')->insert([
            ['title' => 'Dune: Part Two', 'duration_minutes' => 166, 'status' => 'showing'],
            ['title' => 'Godzilla x Kong', 'duration_minutes' => 115, 'status' => 'showing'],
            ['title' => 'Kung Fu Panda 4', 'duration_minutes' => 94, 'status' => 'showing'],
        ]);

        // Create a Studio
        \DB::table('studios')->insert([
            ['name' => 'Studio 1', 'capacity' => 20]
        ]);
    }
}
