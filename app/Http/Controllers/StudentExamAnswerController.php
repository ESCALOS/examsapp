<?php

namespace App\Http\Controllers;

use App\Models\Exam;
use App\Models\ExamQuestion;
use App\Models\StudentExamAnswer;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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

    public function getRankingByExamAndSection(int $examId)
    {
        // Encuentra el examen por ID
        $exam = Exam::findOrFail($examId);

        // Obtén las preguntas y sus respuestas correctas del examen
        $questions = ExamQuestion::where('exam_id', $examId)
            ->select('question_number', 'correct_answer')
            ->get()
            ->toArray(); // Convertir a array para asegurar su iteración correcta

        // Obtén al profesor relacionado con el examen
        $teacher = Teacher::where('academic_year_id', $exam->academic_year_id)->where('user_id', Auth::id())->first();

        // Obtén las respuestas de los estudiantes
        $answers = StudentExamAnswer::with('student:id,name,status')
            ->where('exam_id', $examId)
            ->whereHas('student', function ($query) use ($teacher) {
                $query->where('teacher_id', $teacher->id);
            })
            ->get(['student_id', 'question_number', 'answer']);

        // Inicializa el mapeo de estudiantes y sus respuestas
        $studentsMap = [];

        foreach ($answers as $answer) {
            // Inicializa los datos del estudiante si no existen
            if (! isset($studentsMap[$answer->student_id])) {
                $studentsMap[$answer->student_id] = [
                    'student' => $answer->student,
                    'correct' => 0,
                    'incorrect' => 0,
                    'blank' => 0,
                ];
            }

            // Encuentra la respuesta correcta para la pregunta
            $correctAnswer = collect($questions)->firstWhere('question_number', $answer->question_number)['correct_answer'] ?? null;

            // Lógica para determinar si la respuesta es correcta, incorrecta o en blanco
            if ($answer->answer === null) {
                $studentsMap[$answer->student_id]['blank']++;
            } elseif ($answer->answer === $correctAnswer) {
                $studentsMap[$answer->student_id]['correct']++;
            } else {
                $studentsMap[$answer->student_id]['incorrect']++;
            }
        }

        // Convertir a un array, ordenar por respuestas correctas y generar el ranking
        $sortedStudents = collect($studentsMap)
            ->sortByDesc('correct')
            ->values();

        // Asignar posiciones en el ranking
        $rank = 1;
        $previousScore = $sortedStudents[0]['correct'] ?? 0;

        $sortedStudents = $sortedStudents->map(function ($studentData, $index) use (&$rank, &$previousScore) {
            if ($studentData['correct'] !== $previousScore) {
                $rank = $index + 1;
                $previousScore = $studentData['correct'];
            }

            $studentData['rank'] = $rank;

            return $studentData;
        });

        // Retornar el ranking calculado al cliente
        return response()->json([
            'ranking' => $sortedStudents,
        ]);
    }

    public function getRankingByExam(int $examId)
    {
        // Encuentra el examen por ID
        Exam::findOrFail($examId);

        // Obtén las preguntas y sus respuestas correctas del examen
        $questions = ExamQuestion::where('exam_id', $examId)
            ->select('question_number', 'correct_answer')
            ->get()
            ->toArray(); // Convertir a array para asegurar su iteración correcta

        // Obtén las respuestas de los estudiantes
        $answers = StudentExamAnswer::with('student:id,name,status')
            ->where('exam_id', $examId)
            ->get(['student_id', 'question_number', 'answer']);

        // Inicializa el mapeo de estudiantes y sus respuestas
        $studentsMap = [];

        foreach ($answers as $answer) {
            // Inicializa los datos del estudiante si no existen
            if (! isset($studentsMap[$answer->student_id])) {
                $studentsMap[$answer->student_id] = [
                    'student' => $answer->student,
                    'correct' => 0,
                    'incorrect' => 0,
                    'blank' => 0,
                ];
            }

            // Encuentra la respuesta correcta para la pregunta
            $correctAnswer = collect($questions)->firstWhere('question_number', $answer->question_number)['correct_answer'] ?? null;

            // Lógica para determinar si la respuesta es correcta, incorrecta o en blanco
            if ($answer->answer === null) {
                $studentsMap[$answer->student_id]['blank']++;
            } elseif ($answer->answer === $correctAnswer) {
                $studentsMap[$answer->student_id]['correct']++;
            } else {
                $studentsMap[$answer->student_id]['incorrect']++;
            }
        }

        // Convertir a un array, ordenar por respuestas correctas y generar el ranking
        $sortedStudents = collect($studentsMap)
            ->sortByDesc('correct')
            ->values();

        // Asignar posiciones en el ranking
        $rank = 1;
        $previousScore = $sortedStudents[0]['correct'] ?? 0;

        $sortedStudents = $sortedStudents->map(function ($studentData, $index) use (&$rank, &$previousScore) {
            if ($studentData['correct'] !== $previousScore) {
                $rank = $index + 1;
                $previousScore = $studentData['correct'];
            }

            $studentData['rank'] = $rank;

            return $studentData;
        });

        // Retornar el ranking calculado al cliente
        return response()->json([
            'ranking' => $sortedStudents,
        ]);
    }
}
