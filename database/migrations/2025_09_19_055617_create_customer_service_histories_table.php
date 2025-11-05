<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('customer_service_histories', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('customer_service_id')->index();
            $table->integer('status');
            $table->text('note')->nullable();
            $table->unsignedBigInteger('changed_by')->nullable()->index();
            $table->timestamps();

            $table->foreign('customer_service_id')->references('id')->on('customer_services')->onDelete('cascade');
            $table->foreign('changed_by')->references('id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customer_service_histories');
    }
};
