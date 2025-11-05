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
        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->index();
            $table->string('customer_id')->unique();
            $table->string('cus_id')->unique();
            $table->string('name_mm')->nullable();
            $table->string('nationality')->nullable();
            $table->date('dob')->nullable();
            $table->string('sex')->nullable();
            $table->string('nrc_no')->nullable();
            $table->string('passport_no')->nullable();
            $table->date('passport_expiry')->nullable();
            $table->string('visa_type')->nullable();
            $table->date('visa_expiry')->nullable();
            $table->string('ci_no')->nullable();
            $table->date('ci_expiry')->nullable();
            $table->string('pink_card_no')->nullable();
            $table->date('pink_card_expiry')->nullable();
            $table->string('phone')->nullable(); // primary phone
            $table->string('phone_secondary')->nullable();
            $table->text('address')->nullable();
            $table->unsignedBigInteger('created_by')->nullable()->index();
            $table->unsignedBigInteger('updated_by')->nullable()->index();
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('created_by')->references('id')->on('users')->onDelete('set null');
            $table->foreign('updated_by')->references('id')->on('users')->onDelete('set null');
            $table->index('created_at');
            $table->index('updated_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customers');
    }
};
