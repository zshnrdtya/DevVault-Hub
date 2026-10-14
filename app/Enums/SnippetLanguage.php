<?php

namespace App\Enums;

enum SnippetLanguage: string
{
    case Php = 'php';
    case Javascript = 'javascript';
    case Typescript = 'typescript';
    case Tsx = 'tsx';
    case Sql = 'sql';
    case Python = 'python';
    case Html = 'html';
    case Css = 'css';
    case Bash = 'bash';
    case Json = 'json';
    case Markdown = 'markdown';

    /**
     * @return array<string, string>
     */
    public static function options(): array
    {
        return [
            self::Php->value => 'PHP',
            self::Javascript->value => 'JavaScript',
            self::Typescript->value => 'TypeScript',
            self::Tsx->value => 'React (TSX)',
            self::Sql->value => 'SQL',
            self::Python->value => 'Python',
            self::Html->value => 'HTML',
            self::Css->value => 'CSS',
            self::Bash->value => 'Bash / Shell',
            self::Json->value => 'JSON',
            self::Markdown->value => 'Markdown',
        ];
    }

    /**
     * @return list<string>
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
