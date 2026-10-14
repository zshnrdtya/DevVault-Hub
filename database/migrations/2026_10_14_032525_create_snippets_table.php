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
        Schema::create('snippets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('category_id')->nullable()->constrained()->nullOnDelete();
            $table->string('title', 150);
            $table->text('description')->nullable();
            $table->longText('code');
            $table->string('language', 50)->default('javascript');
            $table->boolean('is_favorite')->default(false);
            $table->timestamp('last_copied_at')->nullable();
            $table->unsignedInteger('copy_count')->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['user_id', 'language']);
            $table->index(['user_id', 'is_favorite']);
            $table->index(['user_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('snippets');
    }
};
