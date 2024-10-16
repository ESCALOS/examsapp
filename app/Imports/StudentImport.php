<?php

namespace App\Imports;

use App\Models\Student;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithSkipDuplicates;

class StudentImport implements ToModel, WithHeadingRow, WithSkipDuplicates
{
    public function __construct(public int $academicYearId, public string $grade, public string $section) {}

    /**
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function model(array $row)
    {
        return new Student([
            'dni' => $row['dni'] ?? $row['DNI'] ?? null,
            'name' => $row['nombres'] ?? $row['Nombres'] ?? null,
            'academic_year_id' => $this->academicYearId,
            'grade' => $this->grade,
            'section' => $this->section,
        ]);
    }
}
