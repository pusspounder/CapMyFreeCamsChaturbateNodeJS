@echo off

set savedir=%1
set targetfiletype=*.ts

for %%a in (%savedir%\%targetfiletype%) do (
	call :fix "%%a"
	)

goto :eof

rem ----------------------------------------------------------------------------
:fix

call :setsize %1
rem delte if less than size in bytes
rem 10mb 10485760
rem 50mb 52428800
rem 100mb 104857600
if %size% lss 52428800 (
del %1
goto :eof
)

set output=%1
set output=%output:~0,-3%mkv"

echo.
echo ==================================================
echo Converting %~nx1 to MKV, copying video and audio stream directly, no transcoding!...
echo ==================================================
rem -y overwite output without asking
rem ffmpeg.exe -loglevel warning -y -i %1 -c:v copy -c:a copy %output%
ffmpeg.exe -y -i %1 -c:v copy -c:a copy %output%
goto :eof
rem ----------------------------------------------------------------------------

rem ----------------------------------------------------------------------------
:setsize
set size=%~z1
goto :eof
rem ----------------------------------------------------------------------------