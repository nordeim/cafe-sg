<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('events', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('slug')->unique();
            $table->string('title');
            $table->text('description')->nullable();
            $table->integer('price_cents')->default(0);
            $table->integer('duration_minutes')->default(60);
            $table->timestamps();
        });

        Schema::create('event_sessions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('event_id')->constrained('events')->cascadeOnDelete();
            $table->timestamp('starts_at');
            $table->integer('capacity');
            $table->integer('booked_count')->default(0);
            $table->timestamps();

            $table->index('starts_at');
        });

        Schema::create('bookings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('session_id')->constrained('event_sessions');
            $table->string('user_email');
            $table->integer('quantity');
            $table->string('status')->default('confirmed'); // confirmed, cancelled
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bookings');
        Schema::dropIfExists('event_sessions');
        Schema::dropIfExists('events');
    }
};