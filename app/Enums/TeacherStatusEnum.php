<?php

namespace App\Enums;

enum TeacherStatusEnum: string
{
    case Active = 'active';
    case Retired = 'retired';

    // Método que retorna una etiqueta más legible para el estado
    public function label(): string
    {
        return match ($this) {
            self::Active => 'Activo',
            self::Retired => 'Retirado',
        };
    }

    // Método para obtener los valores del enum
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
