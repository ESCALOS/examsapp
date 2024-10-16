<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use App\Models\Teacher;
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

        // Devolver la vista de Inertia con los profesores filtrados
        return Inertia::render('Admin/Classrooms', [
            'year' => $year,
            'teachers' => $teachers,
            'academicYears' => AcademicYear::all(),
            'selectedYear' => $academicYear, // Este será el año seleccionado
        ]);
    }
}
