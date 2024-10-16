<?php

namespace App\Http\Controllers;

use App\Enums\RoleEnum;
use App\Http\Requests\StoreExamRequest;
use App\Http\Requests\UpdateExamRequest;
use App\Models\AcademicYear;
use App\Models\Exam;
use App\Models\ExamQuestion;
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

        // Devolver la vista de Inertia con los profesores filtrados
        return Inertia::render('Admin/Exams', [
            'year' => $year,
            'academicYears' => AcademicYear::all(),
            'selectedYear' => $academicYear,
            'exams' => Exam::with('questions')->where('academic_year_id', $academicYear->id)->get(),
        ]);

    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
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
    }
}
