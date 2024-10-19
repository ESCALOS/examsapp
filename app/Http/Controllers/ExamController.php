<?php

namespace App\Http\Controllers;

use App\Enums\RoleEnum;
use App\Http\Requests\StoreExamRequest;
use App\Http\Requests\UpdateExamRequest;
use App\Models\AcademicYear;
use App\Models\Exam;
use App\Models\ExamQuestion;
use App\Models\Student;
use App\Models\StudentExamAnswer;
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
        $academicYear = AcademicYear::where('year', $year)->select('id', 'year')->firstOrFail();
        $user = Auth::user();
        $teacherId = Auth::user()->role === RoleEnum::TEACHER ? $user->id : 0;

        if ($teacherId > 0) {
            $teacher = Teacher::where('user_id', $user->id)->where('academic_year_id', $academicYear->id)->first();

            if ($teacher) {
                // Obtener todos los exámenes y filtrar las respuestas mediante subconsulta
                $exams = Exam::where('academic_year_id', $academicYear->id)
                    ->where('grade', $teacher->grade)
                    ->withCount(['answers as students_evaluated' => function ($query) use ($teacher) {
                        $query->whereHas('student', function ($studentQuery) use ($teacher) {
                            $studentQuery->where('teacher_id', $teacher->id);
                        })->select(DB::raw('COUNT(DISTINCT(student_id))'));
                    }])
                    ->get(['id', 'name', 'grade']);

                $students = Student::where('teacher_id', $teacher->id)
                    ->get();

                return Inertia::render('Teacher/Exams', [
                    'year' => $year,
                    'academicYears' => AcademicYear::select('id', 'year')->get(),
                    'selectedYear' => $academicYear,
                    'exams' => $exams,
                    'students' => $students,
                ]);
            } else {
                return Inertia::render('Teacher/Exams', [
                    'year' => $year,
                    'academicYears' => AcademicYear::select('id', 'year')->get(),
                    'selectedYear' => $academicYear,
                    'exams' => [],
                ]);
            }
        } else {
            // Si no es un profesor, obtener todos los exámenes
            $exams = Exam::where('academic_year_id', $academicYear->id)->select('id', 'name', 'grade')->get();

            return Inertia::render('Admin/Exams', [
                'year' => $year,
                'academicYears' => AcademicYear::select('id', 'year')->get(),
                'selectedYear' => $academicYear,
                'exams' => $exams,
            ]);
        }
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

    public function getEvaluatedStudentsByExam(int $examId, int $academicYearId)
    {
        $teacher = Teacher::where('user_id', Auth::user()->id)->where('academic_year_id', $academicYearId)->first();

        $exam = Exam::with('questions')->find($examId);

        $evaluatedStudentIds = StudentExamAnswer::where('exam_id', $examId)
            ->whereHas('student', function ($query) use ($teacher) {
                $query->where('teacher_id', $teacher->id);
            })
            ->pluck('student_id') // Obtén solo los IDs de los estudiantes
            ->unique()
            ->values()
            ->toArray(); // Elimina los IDs duplicados

        // Mapeamos solo el id, name y la cantidad de preguntas
        $examData = [
            'academic_year_id' => $academicYearId,
            'id' => $exam->id,
            'name' => $exam->name,
            'questions_count' => $exam->questions->count(), // Obtenemos la cantidad de preguntas
            'evaluated_student_ids' => $evaluatedStudentIds,
        ];

        return response()->json($examData);
    }

    public function getAnswersByStudent(int $studentId)
    {
        $answers = StudentExamAnswer::where('student_id', $studentId)->select('exam_id', 'question_number', 'answer')->get();

        return response()->json($answers);
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
