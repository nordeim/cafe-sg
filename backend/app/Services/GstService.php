<?php

namespace App\Services;

class GstService
{
    /**
     * Calculate GST breakdown from an inclusive total amount.
     * 
     * Formula: 
     * Tax Fraction = 9 / 109
     * GST Amount = Total * (9 / 109)
     * Subtotal = Total - GST Amount
     */
    public function calculateFromInclusive(int $totalCents): array
    {
        $gstRate = 9.00;
        
        // Round half up for cents
        $gstCents = (int) round($totalCents * 9 / 109);
        $subtotalCents = $totalCents - $gstCents;

        return [
            'subtotal_cents' => $subtotalCents,
            'gst_cents' => $gstCents,
            'total_cents' => $totalCents,
            'gst_rate' => $gstRate,
        ];
    }
}
