<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreStudentInfoRequest;
use App\Http\Requests\UpdateStudentInfoRequest;
use App\Models\StudentInfo;

class StudentInfoController extends Controller
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
    public function store(StoreStudentInfoRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(StudentInfo $studentInfo)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(StudentInfo $studentInfo)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateStudentInfoRequest $request, StudentInfo $studentInfo)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(StudentInfo $studentInfo)
    {
        //
    }
}
