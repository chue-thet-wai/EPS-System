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
        Schema::create('teachers', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->index();
            $table->string('name')->index();
            $table->string('login_name')->index()->index();
            $table->timestamp('startworking_date')->nullable()->index();
            $table->string('gender')->index();
            $table->string('email')->index();
            $table->string('contact_number')->nullable()->index();
            $table->text('address')->nullable();
            $table->text('remark')->nullable();
            $table->tinyInteger('resign_status')->default(1)->comment('0 :resign , 1:active')->index();          
            $table->string('job_title')->nullable()->index();
            $table->timestamp('login_date')->nullable()->index();
            $table->timestamp('logout_date')->nullable()->index();
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
        Schema::dropIfExists('teachers');
    }
};
