<?php

namespace App\Enums;

enum StudentStatusEnum: string
{
    case Active = 'active';
    case Transferred = 'transferred';
    case Withdrawn = 'withdrawn';

    // Método que retorna una etiqueta más legible para el estado
    public function label(): string
    {
        return match ($this) {
            self::Active => 'Activo',
            self::Transferred => 'Trasladado',
            self::Withdrawn => 'Retirado',
        };
    }

    // Método para obtener los valores del enum
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
