<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('slug')->unique();
            $table->string('name');
            $table->text('description')->nullable();
            $table->integer('price_cents');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('inventory', function (Blueprint $table) {
            $table->string('sku')->primary();
            $table->integer('stock_count')->default(0);
            $table->integer('reserved_count')->default(0);
            $table->timestamps();
        });

        Schema::create('inventory_reservations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('sku');
            $table->foreign('sku')->references('sku')->on('inventory');
            $table->integer('quantity');
            $table->timestamp('expires_at');
            $table->string('status')->default('active'); // active, committed, expired
            $table->timestamps();
            
            $table->index('expires_at');
            $table->index('status');
        });

        Schema::create('inventory_ledger', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('sku');
            $table->foreign('sku')->references('sku')->on('inventory');
            $table->integer('quantity_change');
            $table->string('reason'); // reservation, commit, release, adjustment
            $table->uuid('reference_id')->nullable();
            $table->timestamp('created_at')->useCurrent();
            
            $table->index('sku');
        });

        Schema::create('orders', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->integer('subtotal_cents');
            $table->integer('gst_cents');
            $table->integer('total_cents');
            $table->decimal('gst_rate', 4, 2)->default(9.00);
            $table->string('invoice_number')->nullable()->unique();
            $table->string('status')->default('pending'); // pending, paid, failed, cancelled
            $table->string('email')->nullable();
            $table->timestamps();
            
            $table->index('status');
            $table->index('email');
        });

        Schema::create('order_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('order_id')->constrained('orders')->cascadeOnDelete();
            $table->foreignUuid('product_id')->constrained('products');
            $table->integer('quantity');
            $table->integer('price_at_time_cents');
            $table->timestamps();
        });

        Schema::create('payments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('order_id')->constrained('orders');
            $table->string('stripe_payment_intent_id')->unique();
            $table->integer('amount_cents');
            $table->string('status');
            $table->timestamps();
        });

        Schema::create('webhook_events', function (Blueprint $table) {
            $table->string('id')->primary(); // Stripe Event ID
            $table->timestamp('processed_at')->nullable();
            $table->json('payload');
            $table->timestamps();
        });

        Schema::create('invoices', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('order_id')->constrained('orders');
            $table->string('provider_transmission_id')->nullable();
            $table->string('status')->default('draft'); // draft, generated, transmitted, failed
            $table->timestamps();
        });

        Schema::create('invoice_transmissions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('invoice_id')->constrained('invoices');
            $table->timestamp('attempt_at');
            $table->json('response_payload')->nullable();
            $table->boolean('success');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('invoice_transmissions');
        Schema::dropIfExists('invoices');
        Schema::dropIfExists('webhook_events');
        Schema::dropIfExists('payments');
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
        Schema::dropIfExists('inventory_ledger');
        Schema::dropIfExists('inventory_reservations');
        Schema::dropIfExists('inventory');
        Schema::dropIfExists('products');
    }
};
