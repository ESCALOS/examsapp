<?php

namespace App\Http\Controllers;

use App\Enums\RoleEnum;
use App\Http\Requests\StoreExamRequest;
use App\Http\Requests\UpdateExamRequest;
use App\Models\AcademicYear;
use App\Models\Exam;
use App\Models\ExamQuestion;
use App\Models\Student;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ExamController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(string $year = '')
    {
        if (empty($year)) {
            $year = AcademicYear::orderBy('id', 'desc')->first()->year;
        }

        // Buscar el año académico según el slug del año
        $academicYear = AcademicYear::where('year', $year)->firstOrFail();
        $component = 'Admin/Exams';
        $user = Auth::user();
        $teacherId = Auth::user()->role === RoleEnum::TEACHER ? $user->id : 0;
        $students = [];
        $exams = [];

        if ($teacherId > 0) {
            $teacher = Teacher::where('user_id', $user->id)->where('academic_year_id', $academicYear->id)->first();

            if ($teacher) {
                // Obtener todos los exámenes y filtrar las respuestas mediante subconsulta
                $exams = Exam::with(['questions', 'answers' => function ($query) use ($teacher) {
                    $query->whereHas('student', function ($q) use ($teacher) {
                        $q->where('grade', $teacher->grade)
                            ->where('section', $teacher->section);
                    })
                        ->with('student');
                }])
                    ->where('academic_year_id', $academicYear->id)
                    ->where('grade', $teacher->grade)
                    ->get();

                $students = Student::where('academic_year_id', $academicYear->id)
                    ->where('grade', $teacher->grade)
                    ->where('section', $teacher->section)
                    ->get();

                $component = 'Teacher/Exams';
            }
        } else {
            // Si no es un profesor, obtener todos los exámenes
            $exams = Exam::with(['questions', 'answers.student'])
                ->where('academic_year_id', $academicYear->id)
                ->get();
        }

        // Devolver la vista de Inertia con los profesores filtrados
        return Inertia::render($component, [
            'year' => $year,
            'academicYears' => AcademicYear::all(),
            'selectedYear' => $academicYear,
            'exams' => $exams,
            'students' => $students,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreExamRequest $request)
    {
        $request->validated();

        // Iniciar una transacción
        DB::transaction(function () use ($request) {
            // Crear el examen
            $exam = Exam::create([
                'name' => $request->name,
                'academic_year_id' => $request->academicYearId,
                'grade' => $request->grade,
            ]);

            // Guardar las preguntas asociadas al examen
            foreach ($request->questions as $index => $question) {
                ExamQuestion::create([
                    'exam_id' => $exam->id,
                    'question_number' => $index + 1, // Asigna el número de pregunta
                    'correct_answer' => $question['correctAnswer'],
                ]);
            }
        });

        return back()->with('message', 'Se ha creado el examen correctamente');
    }

    /**
     * Display the specified resource.
     */
    public function show(Exam $exam)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Exam $exam)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateExamRequest $request)
    {
        $request->validated();

        // Iniciar una transacción
        DB::transaction(function () use ($request) {

            $exam = Exam::find($request->id);
            // Actualizar el examen
            $exam->update([
                'name' => $request->name,
                'academic_year_id' => $request->academicYearId,
                'grade' => $request->grade,
            ]);

            // Eliminar preguntas antiguas
            $exam->questions()->delete();

            // Guardar las preguntas asociadas al examen
            foreach ($request->questions as $index => $question) {
                ExamQuestion::create([
                    'exam_id' => $exam->id,
                    'question_number' => $index + 1, // Asigna el número de pregunta
                    'correct_answer' => $question['correctAnswer'],
                ]);
            }
        });

        return back()->with('message', 'Se ha actualizado el examen correctamente');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {
        if (Auth::user()->role !== RoleEnum::ADMIN) {
            return back()->withErrors(['message' => 'No puedes eliminar examenes']);
        }

        Exam::find($request->id)->delete();

        return back()->with('message', 'Se ha eliminado el examen correctamente');
    }
}
