<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreStudentExamReviewRequest;
use App\Models\StudentExamAnswer;

class ExamReviewController extends Controller
{
    public function store(StoreStudentExamReviewRequest $request)
    {
        $validated = $request->validated();

        $studentId = $validated['student']['id'];
        $examId = $validated['exam']['id'];
        $answers = $validated['answers'];

        // Itera sobre las respuestas y guarda cada una en la base de datos
        foreach ($validated['exam']['questions'] as $index => $question) {
            StudentExamAnswer::updateOrCreate(
                [
                    'student_id' => $studentId,
                    'exam_id' => $examId,
                    'question_number' => $question['question_number'],
                ],
                [
                    'answer' => $answers[$index], // Respuesta seleccionada
                ]
            );
        }

        return back()->with('message', 'Revisión guardada exitosamente');
    }
}
