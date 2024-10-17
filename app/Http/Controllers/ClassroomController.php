<?php

namespace App\Http\Controllers;

use App\Enums\RoleEnum;
use App\Http\Requests\StoreTeacherRequest;
use App\Http\Requests\UpdateTeacherRequest;
use App\Imports\StudentImport;
use App\Models\AcademicYear;
use App\Models\Student;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class ClassroomController extends Controller
{
    public function index(string $year = '')
    {
        if (empty($year)) {
            $year = AcademicYear::orderBy('id', 'desc')->first()->year;
        }
        // Buscar el año académico según el slug del año
        $academicYear = AcademicYear::where('year', $year)->firstOrFail();

        // Obtener los profesores para ese año académico
        $teachers = Teacher::with('user', 'academicYear')
            ->where('academic_year_id', $academicYear->id)
            ->get();

        $students = Student::where('academic_year_id', $academicYear->id)->get();

        // Devolver la vista de Inertia con los profesores filtrados
        return Inertia::render('Admin/Classrooms', [
            'year' => $year,
            'teachers' => $teachers,
            'selectedYear' => $academicYear, // Este será el año seleccionado
            'students' => $students,
        ]);
    }

    public function addSection(StoreTeacherRequest $request)
    {
        $request->validated();

        Teacher::create([
            'user_id' => $request->userId,
            'academic_year_id' => $request->academicYearId,
            'grade' => $request->grade,
            'section' => $request->section,
        ]);

        return back()->with('message', 'Se ha añadido la sección correctamente');
    }

    public function updateSection(UpdateTeacherRequest $request)
    {
        $request->validated();

        DB::transaction(function () use ($request) {
            $teacher = Teacher::find($request->id);
            Student::where('academic_year_id', $request->academicYearId)
                ->where('grade', $request->grade)
                ->where('section', $teacher->section)
                ->update([
                    'section' => $request->section,
                ]);
            $teacher->update([
                'user_id' => $request->userId,
                'section' => $request->section,
            ]);

        });

        return back()->with('message', 'Se ha actualizado la sección correctamente');
    }

    public function deleteSection(Request $request)
    {
        if (Auth::user()->role !== RoleEnum::ADMIN) {
            return back()->withErrors(['message' => 'No puedes eliminar secciones']);
        }

        DB::transaction(function () use ($request) {
            $teacher = Teacher::find($request->id);

            // Asegurarse de que el profesor existe antes de eliminarlo
            if ($teacher) {
                // Eliminar estudiantes basados en los criterios
                Student::where('academic_year_id', 2)
                    ->where('grade', 1)
                    ->where('section', 'D')
                    ->delete();

                // Eliminar al profesor
                $teacher->delete();
            }
        });

        // return back()->with('message', 'Se ha eliminado la sección correctamente');
    }

    public function importStudents(Request $request)
    {
        $file = $request->file('file');

        Student::where('academic_year_id', $request->academicYearId)
            ->where('grade', $request->grade)
            ->where('section', $request->section)
            ->delete();

        Excel::import(new StudentImport($request->academicYearId, $request->grade, $request->section), $file);

        return back()->with('message', 'Se han importado correctamente los estudiantes');
    }
}
