<?php

namespace App\Enums;

enum RoleEnum: string
{
    case ADMIN = 'admin';
    case TEACHER = 'teacher';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    public function label()
    {
        return match ($this) {
            self::ADMIN => 'Administrador',
            self::TEACHER => 'Docente'
        };
    }
}
