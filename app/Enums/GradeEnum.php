<?php

namespace App\Enums;

enum GradeEnum: int
{
    case Grade1 = 1;
    case Grade2 = 2;
    case Grade3 = 3;
    case Grade4 = 4;
    case Grade5 = 5;
    case Grade6 = 6;

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    // Método que devuelve el nombre del grado
    public function label(): string
    {
        return match ($this) {
            self::Grade1 => 'Primer grado',
            self::Grade2 => 'Segundo grado',
            self::Grade3 => 'Tercer grado',
            self::Grade4 => 'Cuarto grado',
            self::Grade5 => 'Quinto grado',
            self::Grade6 => 'Sexto grado',
        };
    }
}
