<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreExamRequest;
use App\Http\Requests\UpdateExamRequest;
use App\Models\AcademicYear;
use App\Models\Exam;
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
            'exams' => Exam::all(),
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
        //
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
    public function update(UpdateExamRequest $request, Exam $exam)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Exam $exam)
    {
        //
    }
}
