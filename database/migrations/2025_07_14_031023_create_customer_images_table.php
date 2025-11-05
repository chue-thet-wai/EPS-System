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
        Schema::create('customer_images', function (Blueprint $table) {
            $table->id(); 
            $table->unsignedBigInteger('customer_id'); 
            $table->string('passport_image')->nullable();  
            $table->string('visa_image')->nullable(); 
            $table->string('ci_image')->nullable();  
            $table->string('pinkcard_image')->nullable();  
            $table->timestamps(); 

            $table->foreign('customer_id')->references('id')->on('customers')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customer_images');
    }
};
