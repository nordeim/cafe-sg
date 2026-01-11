<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Exception;

class InvoiceNowProviderClient
{
    protected $baseUrl;
    protected $clientId;
    protected $clientSecret;

    public function __construct()
    {
        $this->baseUrl = 'https://sandbox.api.provider.com/v1'; // Mock URL
        $this->clientId = env('INVOICENOW_CLIENT_ID');
        $this->clientSecret = env('INVOICENOW_CLIENT_SECRET');
    }

    public function send(array $payload): string
    {
        // Mock implementation if no real credentials
        if ($this->clientId === 'placeholder') {
            Log::info('Mocking InvoiceNow transmission', $payload);
            return 'MOCK-' . uniqid();
        }

        $response = Http::withBasicAuth($this->clientId, $this->clientSecret)
            ->post("{$this->baseUrl}/invoices", $payload);

        if (!$response->successful()) {
            throw new Exception("InvoiceNow provider error: " . $response->body());
        }

        return $response->json('transmission_id');
    }
}
