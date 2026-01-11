<?php

namespace App\Services;

use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class MailService
{
    public function sendWelcome(string $email)
    {
        Log::info("Sending welcome email to: {$email}");
        
        // Using raw mail for prototype simplicity, but ideally Mailable class
        Mail::raw('Welcome to the Merlion Brews Manuscript. Your code: HERITAGE15', function ($message) use ($email) {
            $message->to($email)
                ->subject('Welcome to the Manuscript');
        });
    }
}
