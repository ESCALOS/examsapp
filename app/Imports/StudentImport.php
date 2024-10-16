<?php

namespace App\Imports;

use App\Models\Student;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithSkipDuplicates;

class StudentImport implements ToModel, WithSkipDuplicates
{
    public function __construct(public int $academicYearId, public string $grade, public string $section) {}

    /**
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function model(array $row)
    {
        if (! isset($row[0])) {
            return null;
        }

        return new Student([
            'name' => $row[0],
            'academic_year_id' => $this->academicYearId,
            'grade' => $this->grade,
            'section' => $this->section,
        ]);
    }
}
