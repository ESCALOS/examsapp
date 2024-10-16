<?php

namespace App\Http\Controllers;

use App\Enums\RoleEnum;
use App\Http\Requests\StoreTeacherRequest;
use App\Http\Requests\UpdateTeacherRequest;
use App\Models\AcademicYear;
use App\Models\Student;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ClassroomController extends Controller
{
    public function index(string $year = '')
    {
        if (empty($year)) {
            $year = AcademicYear::latest()->first()->year;
        }
        // Buscar el año académico según el slug del año
        $academicYear = AcademicYear::where('year', $year)->firstOrFail();

        // Obtener los profesores para ese año académico
        $teachers = Teacher::with('user', 'academicYear')
            ->where('academic_year_id', $academicYear->id)
            ->get();

        $students = Student::with('studentInfo')->where('academic_year_id', $academicYear->id)->get();

        // Devolver la vista de Inertia con los profesores filtrados
        return Inertia::render('Admin/Classrooms', [
            'year' => $year,
            'teachers' => $teachers,
            'academicYears' => AcademicYear::all(),
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

        // return back()->with('message', 'Se ha añadido la sección correctamente');
    }

    public function updateSection(UpdateTeacherRequest $request)
    {
        $request->validated();

        Teacher::find($request->id)
            ->update([
                'user_id' => $request->userId,
                'section' => $request->section,
            ]);

        // return back()->with('message', 'Se ha actualizado la sección correctamente');
    }

    public function deleteSection(Request $request)
    {
        if (Auth::user()->role !== RoleEnum::ADMIN) {
            return back()->withErrors(['message' => 'No puedes eliminar secciones']);
        }

        Teacher::find($request->id)->delete();

        // return back()->with('message', 'Se ha eliminado la sección correctamente');
    }
}
