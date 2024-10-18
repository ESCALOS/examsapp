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
use Illuminate\Support\Facades\Log;
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

        // Obtener los profesores asignados con la información del usuario, año académico y cantidad de estudiantes
        $assignedTeachers = Teacher::select('id', 'grade', 'section', 'user_id', 'academic_year_id')
            ->with([
                'user:id,dni,name,is_active',  // Solo los campos necesarios de User
                'students:id,teacher_id', // Cargar estudiantes relacionados
            ])
            ->where('academic_year_id', $academicYear->id)
            ->get()
            ->map(function ($teacher) {
                return [
                    'id' => $teacher->id,
                    'grade' => $teacher->grade,
                    'section' => $teacher->section,
                    'user_id' => $teacher->user_id,
                    'academic_year_id' => $teacher->academic_year_id,
                    'student_count' => $teacher->students->count(), // Contar estudiantes
                    'user' => $teacher->user, // Incluir información del usuario
                ];
            });

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
    }

    public function importStudents(Request $request)
    {
        $file = $request->file('file');

        try {
            Excel::import(new StudentImport($request->teacherId), $file);

            // Redirigir o retornar éxito
            return back()->with('message', 'Se han importado correctamente los estudiantes');
        } catch (\Exception $e) {
            Log::error('Error al importar estudiantes: '.$e->getMessage());

            // Manejar el error, tal vez redirigir con un mensaje de error
            return back()->withErrors('error', $e->getMessage());
        }

    }

    public function getStudentsByTeacher($teacherId)
    {
        $students = Student::where('teacher_id', $teacherId)->select('id', 'name')->get();

        return response()->json($students);
    }

    public function deleteStudent(Request $request)
    {
        if (Auth::user()->role !== RoleEnum::ADMIN) {
            return back()->withErrors(['message' => 'No puedes eliminar estudiantes']);
        }

        Student::find($request->id)->delete();

        return back()->with('message', 'Se ha eliminado el estudiante correctamente');
    }
}
