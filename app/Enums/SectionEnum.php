<?php

namespace App\Enums;

enum SectionEnum: string
{
    case A = 'A';
    case B = 'B';
    case C = 'C';
    case D = 'D';
    case E = 'E';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
