@echo off
set YUI=%~dp0\yuicompressor-2.4.7.jar
set MAIN=..\main
set RELEASE=..\release

rd "%RELEASE%" /s /q
md "%RELEASE%"
xcopy "%MAIN%" "%RELEASE%" /e
rd "%RELEASE%\scripts" /s /q
rd "%RELEASE%\styles" /s /q

call:doCompress "scripts"
call:doCompress "scripts\handle"
call:doCompress "scripts\model"
call:doCompress "scripts\util"
call:doCompress "styles"
md "%RELEASE%\scripts\lib"
copy "%MAIN%\scripts\lib\*" "%RELEASE%\scripts\lib\"

echo finish
pause
goto:eof

:doCompress
echo %~1
md "%RELEASE%\%~1"
set SOURCE="%MAIN%\%~1"
set TARGET="%RELEASE%\%~1"
for /f "delims=" %%i in ('dir "%SOURCE%" /a-d /b') do (java -jar "%YUI%" --charset=utf-8 -o "%TARGET%\%%i" "%SOURCE%\%%i")
goto:eof
