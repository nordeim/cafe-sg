<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Services\CapacityService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Exception;

class BookingController extends Controller
{
    protected $capacityService;

    public function __construct(CapacityService $capacityService)
    {
        $this->capacityService = $capacityService;
    }

    public function index(): JsonResponse
    {
        $events = Event::with(['sessions' => function ($query) {
            $query->where('starts_at', '>', now())->orderBy('starts_at');
        }])->get();

        return response()->json(['data' => $events]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'session_id' => 'required|uuid',
            'email' => 'required|email',
            'quantity' => 'required|integer|min:1',
        ]);

        try {
            $booking = $this->capacityService->reserve(
                $request->input('session_id'),
                $request->input('email'),
                $request->input('quantity')
            );

            return response()->json(['data' => $booking], 201);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }
    }
}
