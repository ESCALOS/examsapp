<?php

namespace App\Http\Requests;

use App\Enums\RoleEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StoreStudentExamReviewRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Auth::user()->role === RoleEnum::TEACHER;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules()
    {
        return [
            'student.id' => 'required|exists:students,id',
            'exam.id' => 'required|exists:exams,id',
            'answers' => 'required|array',
            'answers.*' => 'nullable|in:A,B,C,D,E', // Las posibles respuestas
        ];
    }

    public function messages()
    {
        return [
            'student.id.required' => 'El estudiante es obligatorio.',
            'exam.id.required' => 'El examen es obligatorio.',
            'answers.*.in' => 'Las respuestas deben ser A, B, C, D o E.',
        ];
    }
}
