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

        // Iterar sobre las respuestas y guardarlas
        foreach ($answers as $questionNumber => $answer) {
            if ($answer !== null) { // Guardar solo si la respuesta no es nula
                StudentExamAnswer::updateOrCreate(
                    [
                        'student_id' => $studentId,
                        'exam_id' => $examId,
                        'question_number' => $questionNumber + 1, // Ajustar el número de la pregunta
                    ],
                    [
                        'answer' => $answer,
                    ]
                );
            }
        }

        return back()->with('message', 'Revisión guardada exitosamente');
    }
}
