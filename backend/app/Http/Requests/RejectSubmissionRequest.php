<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RejectSubmissionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'rejection_reason' => 'required|string|min:10|max:1000',
        ];
    }

    /**
     * Get custom error messages for validation rules.
     */
    public function messages(): array
    {
        return [
            'rejection_reason.required' => 'A rejection reason is required.',
            'rejection_reason.min' => 'The rejection reason must be at least 10 characters.',
            'rejection_reason.max' => 'The rejection reason cannot exceed 1000 characters.',
        ];
    }
}
