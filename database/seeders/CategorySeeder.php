<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category; 
use Illuminate\Support\Facades\Auth;

class CategorySeeder extends Seeder
{
    public function run()
    {
        $categoriesName = ['Passport', 'Visa', 'CI', 'Pink Card'];

        foreach ($categoriesName as $name) {
            Category::create([
                'name'       => $name,
                'created_by' => 1, 
            ]);
        }
    }
}
