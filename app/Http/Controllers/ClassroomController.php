<?php

namespace App\Http\Controllers;

use App\Enums\RoleEnum;
use App\Http\Requests\StoreTeacherRequest;
use App\Http\Requests\UpdateTeacherRequest;
use App\Imports\StudentImport;
use App\Models\AcademicYear;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class ClassroomController extends Controller
{
    public function index(string $year = '')
    {
        // Buscar el año académico según el slug del año o el más reciente si no se proporciona
        $academicYear = AcademicYear::when(empty($year), function ($query) {
            return $query->orderBy('id', 'desc');
        }, function ($query) use ($year) {
            return $query->where('year', $year);
        })->select('id', 'year')->firstOrFail();

        // Obtener los profesores asignados con la información del usuario y año académico
        $assignedTeachers = Teacher::select('id', 'grade', 'section', 'user_id', 'academic_year_id')
            ->with([
                'user:id,dni,name,is_active',  // Solo los campos necesarios de User
            ])
            ->where('academic_year_id', $academicYear->id)
            ->get();

        // Docentes no asignados
        $unassignedTeachers = User::select('id', 'dni', 'name', 'is_active')
            ->whereDoesntHave('teachers', function ($query) use ($academicYear) {
                $query->where('academic_year_id', $academicYear->id);
            })
            ->where('role', RoleEnum::TEACHER)  // Filtrar solo docentes
            ->get();

        // Devolver la vista de Inertia con los datos procesados
        return Inertia::render('Admin/Classrooms', [
            'year' => $academicYear->year,
            'assignedTeachers' => $assignedTeachers,
            'unassignedTeachers' => $unassignedTeachers,
            'selectedYear' => $academicYear, // Año académico seleccionado
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

        Teacher::find($request->id)->update([
            'user_id' => $request->userId,
            'section' => $request->section,
        ]);

        return back()->with('message', 'Se ha actualizado la sección correctamente');
    }

    public function deleteSection(Request $request)
    {
        if (Auth::user()->role !== RoleEnum::ADMIN) {
            return back()->withErrors(['message' => 'No puedes eliminar secciones']);
        }

        Teacher::find($request->id)->delete();

        return back()->with('message', 'Se ha eliminado la sección correctamente');
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
