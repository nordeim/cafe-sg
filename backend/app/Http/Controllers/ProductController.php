<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(): JsonResponse
    {
        $products = Product::where('is_active', true)->get();
        return response()->json(['data' => $products]);
    }

    public function show(string $slug): JsonResponse
    {
        $product = Product::where('slug', $slug)->where('is_active', true)->firstOrFail();
        return response()->json(['data' => $product]);
    }
}
