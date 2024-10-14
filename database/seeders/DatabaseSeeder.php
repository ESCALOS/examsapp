<?php

namespace Database\Seeders;

use App\Enums\GradeEnum;
use App\Enums\SectionEnum;
use App\Models\AcademicYear;
use App\Models\Teacher;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Carlos Escate',
            'dni' => '70821326',
            'role' => 'admin',
        ]);

        // Crear años académicos 2023 y 2024
        $academicYears = AcademicYear::factory()->createMany([
            ['year' => 2023],
            ['year' => 2024],
        ]);

        // Crear 18 usuarios
        $users = User::factory(18)->create();

        $grades = GradeEnum::values(); // Grados 1-6
        $sections = SectionEnum::values(); // Secciones A-C

        // Iterar sobre los usuarios para asignar los datos
        foreach ($users as $index => $user) {
            foreach ($academicYears as $academicYear) {
                // Asignar grado cíclicamente de 1 a 6
                $grade = $grades[$index % count($grades)];

                // Asignar sección cíclicamente entre A, B y C
                $section = $sections[$index % count($sections)];

                // Crear el profesor relacionado con el usuario para el año académico actual
                Teacher::factory()->create([
                    'user_id' => $user->id,
                    'academic_year_id' => $academicYear->id,
                    'grade' => $grade,
                    'section' => $section,
                ]);
            }
        }
    }
}
