# Удаляем старые .d.ts файлы
Get-ChildItem -Path ".\" -Recurse -Filter *.d.ts | Remove-Item -ErrorAction Ignore

# Запускаем компиляцию TypeScript
tsc

# Путь к выходному файлу
$outputFile = "ezVZ.d.ts"

# Получаем корень проекта (текущая директория)
$projectRoot = (Get-Location).Path

# Очищаем выходной файл
"" | Set-Content -Path $outputFile

# Собираем все .d.ts файлы рекурсивно
Get-ChildItem -Path ".\" -Recurse -Filter *.d.ts -Exclude $outputFile | ForEach-Object {
    $currentFile = $_.FullName
    $fileRelativeToRoot = Resolve-Path $currentFile -Relative

    # Убираем начальное './' из относительного пути, если есть
    if ($fileRelativeToRoot.StartsWith(".")) {
        $fileRelativeToRoot = $fileRelativeToRoot.Substring(2)
    }

    # Заменяем обратные слеши на прямые и меняем расширение с .d.ts на .ts
    $fileRelativeToRoot = $fileRelativeToRoot -replace '\\', '/' -replace '\.d\.ts$', '.ts'

    # Формируем HTTP-путь для объявления модуля
    $httpModulePath = "https://friendlyted.github.io/ezVZ/core/$fileRelativeToRoot"

    # Читаем содержимое файла
    $content = Get-Content -Path $currentFile -Raw

    # Заменяем declare class на class и declare function на function
    $content = $content -replace 'declare\s+((abstract\s+)?class|function)', '$1'

    # Функция для обработки импортов
    $processedContent = [regex]::Replace($content, '(from|import|declare module)\s+"([^"]+)"', {
        param($match)
        $statement = $match.Groups[1].Value  # from/import/declare module
        $importPath = $match.Groups[2].Value  # путь в импорте

        # Пропускаем абсолютные пути и URL
        if ($importPath.StartsWith("http://") -or $importPath.StartsWith("https://") -or $importPath.StartsWith("/")) {
            return "$statement ""$importPath"""
        }

        # Получаем директорию текущего файла
        $fileDir = Split-Path $currentFile

        # Создаём полный путь к импортируемому файлу
        $fullImportPath = Join-Path $fileDir $importPath

        # Нормализуем путь (разрешаем .. и .)
        $normalizedPath = (Resolve-Path $fullImportPath -ErrorAction SilentlyContinue).Path
        if (-not $normalizedPath) {
            # Если путь не существует, оставляем как есть
            return "$statement ""$importPath"""
        }

        # Получаем путь относительно корня проекта
        $rootRelativePath = Resolve-Path $normalizedPath -Relative

        # Убираем начальное './', если есть
        if ($rootRelativePath.StartsWith(".")) {
            $rootRelativePath = $rootRelativePath.Substring(2)
        }

        # Заменяем обратные слеши на прямые и меняем расширение с .d.ts на .ts
        $rootRelativePath = $rootRelativePath -replace '\\', '/' -replace '\.d\.ts$', '.ts'

        # Подставляем онлайн-ресурс
        $httpImportPath = "https://friendlyted.github.io/ezVZ/core/$rootRelativePath"

        # Возвращаем исправленный импорт
        "$statement ""$httpImportPath"""
    })

    # Добавляем отступ в 4 пробела для содержимого модуля
    $indentedContent = ($processedContent -split "`n" | Where-Object { $_ -ne '' } | ForEach-Object { "    $_"} ) -join "`n"

    # Объединяем объявление модуля, обработанное содержимое с отступами и закрывающую скобку
    $moduleDeclaration = "declare module `"$httpModulePath`" {`n"
    $closingBrace = "`n}"
    $finalContent = "$moduleDeclaration$indentedContent$closingBrace"

    # Добавляем содержимое в выходной файл с комментарием о происхождении
#    "`n// From: $fileRelativeToRoot`n$finalContent`n" | Add-Content -Path $outputFile
    "$finalContent`n" | Add-Content -Path $outputFile
}

Get-ChildItem -Path ".\" -Recurse -Filter *.d.ts -Exclude $outputFile | Remove-Item -ErrorAction Ignore