<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            [
                'name' => 'Singapore Heritage Blend',
                'slug' => 'singapore-heritage-blend',
                'description' => 'Our signature blend honoring Singapore\'s kopi culture, featuring 100% Robusta beans roasted with margarine and sugar in the traditional manner. Bold, full-bodied, and nostalgic—this is the taste of Singapore\'s kopitiams perfected for the modern palate.',
                'price_cents' => 2800,
                'is_active' => true,
            ],
            [
                'name' => 'Peranakan Estate',
                'slug' => 'peranakan-estate',
                'description' => 'Single-origin Arabica from the highlands of Indonesia, where Peranakan families have cultivated coffee for generations. Medium roast with notes of dark chocolate, candied orange, and spice—this bean carries the legacy of the Straits Settlements in every sip.',
                'price_cents' => 3200,
                'is_active' => true,
            ],
            [
                'name' => 'Straits Sourcing',
                'slug' => 'straits-sourcing',
                'description' => 'A tribute to the spice routes that shaped Singapore, this blend combines beans from Malaysia, Vietnam, and Thailand. Dark roasted with a hint of cardamom and star anise, it evokes the aromatic markets of old Singapore where merchants traded coffee alongside spices and silks.',
                'price_cents' => 3600,
                'is_active' => true,
            ],
        ];

        foreach ($products as $product) {
            Product::updateOrCreate(
                ['slug' => $product['slug']],
                $product
            );
        }
    }
}
