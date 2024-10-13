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
        Schema::create('exam_questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('exam_id')->constrained()->onDelete('cascade');

            // El número de la pregunta, restringido a 2 caracteres como máximo
            $table->string('question_number', 2);

            // Restringir la respuesta correcta a solo una letra (A, B, C, D, E)
            $table->enum('correct_answer', ['A', 'B', 'C', 'D', 'E']);

            $table->timestamps();

            // Índice único compuesto: el 'question_number' debe ser único dentro del mismo 'exam_id'
            $table->unique(['exam_id', 'question_number']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exam_questions');
    }
};
