@echo off

set savedir=%1
set inputfiletype=*.ts
set outputfiletype=mkv
set arg1=%~2

for %%a in (%savedir%\%inputfiletype%) do (
	call :fix "%%a"
	)

goto :eof

rem ----------------------------------------------------------------------------

:fix

call :setsize %1
rem delete if less than size in bytes
rem 10mb 10485760
rem 50mb 52428800
rem 100mb 104857600
if %size% lss 52428800 (
del %1
goto :eof
)

set output=%1
set output=%output:~0,-3%%outputfiletype%"

echo.
echo ==================================================
echo Converting %~nx1 to %outputfiletype%, copying video and audio stream directly, no transcoding!...
echo ==================================================

rem -y overwite output without asking
rem less verbose:
rem ffmpeg.exe -loglevel warning -y -i %1 -c:v copy -c:a copy %output%
ffmpeg.exe -y -i %1 -c:v copy -c:a copy %output%

if "%arg1%" == "deleteyes" (
	call :setsize %output%
	if %size% lss 4096 (del %output%) else (echo "DELETING ORIGINAL FLV" & del %1)
	)

if "%arg1%" == "deleteno" (
	call :setsize %output%
	if %size% lss 4096 (del %output%) else (echo "NOT DELETING ORIGINAL FLV")
	)

goto :eof

rem ----------------------------------------------------------------------------

rem ----------------------------------------------------------------------------
:setsize
set size=%~z1
goto :eof
rem ----------------------------------------------------------------------------