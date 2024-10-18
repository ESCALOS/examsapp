<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreStudentExamAnswerRequest;
use App\Http\Requests\UpdateStudentExamAnswerRequest;
use App\Models\StudentExamAnswer;

class StudentExamAnswerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
    public function store(StoreStudentExamAnswerRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(int $examId) {}

    public function showByStudent(int $examId, int $studentId, int $academicYearId)
    {
        //crea para responder con un json las respuestas por estudiante.
        $answers = StudentExamAnswer::where('exam_id', $examId)->where('student_id', $studentId)->where('academic_year_id', $academicYearId)->get();

    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(StudentExamAnswer $studentExamAnswer)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateStudentExamAnswerRequest $request, StudentExamAnswer $studentExamAnswer)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(StudentExamAnswer $studentExamAnswer)
    {
        //
    }
}
