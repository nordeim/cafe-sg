<?php

namespace App\Http\Controllers;

use App\Models\NewsletterSubscriber;
use App\Services\MailService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NewsletterController extends Controller
{
    protected $mailService;

    public function __construct(MailService $mailService)
    {
        $this->mailService = $mailService;
    }

    public function subscribe(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
            'consent_marketing' => 'required|accepted',
        ]);

        $subscriber = NewsletterSubscriber::updateOrCreate(
            ['email' => $request->input('email')],
            [
                'consent_granted_at' => now(),
                'consent_source' => 'web_footer',
                'unsubscribed_at' => null, // Resubscribe if previously unsubscribed
            ]
        );

        if ($subscriber->wasRecentlyCreated) {
            $this->mailService->sendWelcome($subscriber->email);
        }

        return response()->json(['status' => 'subscribed', 'message' => 'Welcome to the Manuscript.']);
    }
}
