<?php

namespace App\Http\Controllers;

use App\Models\StudentExamAnswer;
use Illuminate\Http\Request;

class StudentExamAnswerController extends Controller
{
    public function showAnswersByStudent(int $examId, int $studentId)
    {
        //crea para responder con un json las respuestas por estudiante.
        $answers = StudentExamAnswer::where('exam_id', $examId)
            ->where('student_id', $studentId)
            ->pluck('answer');

        return response()->json($answers);
    }

    public function store(Request $request)
    {
        // Validar los datos entrantes
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'exam_id' => 'required|exists:exams,id',
            'answers' => 'required|array',
            'answers.*' => 'nullable|string|in:A,B,C,D,E', // Asumiendo esas son las posibles respuestas
        ]);

        $studentId = $validated['student_id'];
        $examId = $validated['exam_id'];
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

        return back()->with('message', 'Respuestas guardadas correctamente');
    }
}
