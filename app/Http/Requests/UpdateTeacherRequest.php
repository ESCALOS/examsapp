<?php

namespace App\Http\Requests;

use App\Enums\GradeEnum;
use App\Enums\RoleEnum;
use App\Enums\SectionEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class UpdateTeacherRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Auth::user()->role === RoleEnum::ADMIN;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'userId' => ['required', 'integer', 'exists:users,id'],
            'academicYearId' => ['required', 'integer', 'exists:academic_years,id'],
            'grade' => ['required', 'string', 'max:255', Rule::enum(GradeEnum::class)],
            'section' => ['required', 'string', 'max:255', Rule::enum(SectionEnum::class)],
        ];
    }
}
