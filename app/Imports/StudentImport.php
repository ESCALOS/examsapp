<?php

namespace App\Imports;

use App\Models\Student;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithSkipDuplicates;

class StudentImport implements ToModel, WithSkipDuplicates
{
    public function __construct(public int $teacherId) {}

    /**
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function model(array $row)
    {
        return new Student([
            'name' => $row[0],
            'teacher_id' => $this->teacherId,
        ]);
    }
}
