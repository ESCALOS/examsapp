<?php

namespace App\Http\Controllers;

use App\Enums\RoleEnum;
use App\Http\Requests\UpdateAcademicYearRequest;
use App\Models\AcademicYear;
use Illuminate\Support\Facades\Auth;

class AcademicYearController extends Controller
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
    public function store()
    {
        $currentYear = date('Y');

        // Verificar si es administrador
        if (Auth::user()->role !== RoleEnum::ADMIN) {
            return back()->withErrors(['message' => 'No tienes los permisos necesarios']);
        }

        // Verificar si el año ya existe
        if (AcademicYear::where('year', $currentYear)->exists()) {
            return back()->withErrors(['message' => 'El año académico '.$currentYear.' ya existe']);
        }

        // Crear un nuevo año académico si no existe
        AcademicYear::create([
            'year' => $currentYear,
        ]);

        return back()->with('message', 'Año académico creado exitosamente');
    }

    /**
     * Display the specified resource.
     */
    public function show(AcademicYear $academicYear)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(AcademicYear $academicYear)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAcademicYearRequest $request, AcademicYear $academicYear)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AcademicYear $academicYear)
    {
        //
    }
}
