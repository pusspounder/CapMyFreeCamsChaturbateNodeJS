@ECHO OFF

SET savedir=%1
set targetfiletype=*.ts

FOR %%A IN (%savedir%\%targetfiletype%) DO (
	CALL :FIX "%%A"
	)

goto :EOF

REM ----------------------------------------------------------------------------
:FIX

call :setsize %1
rem delte if less than size in bytes
rem 10mb 10485760
rem 50mb 52428800
rem 100mb 104857600
IF %size% LSS 52428800 (
del %1
GOTO :EOF
)

SET output=%1
SET output=%output:~0,-3%mkv"

echo.
echo ==================================================
echo Converting %~nx1 to MKV, copying video and audio stream directly, no transcoding...
echo ==================================================
REM -y overwite output without asking
rem ffmpeg.exe -loglevel warning -y -i %1 -c:v copy -c:a copy %output%
ffmpeg.exe -y -i %1 -c:v copy -c:a copy %output%
GOTO :EOF
REM ----------------------------------------------------------------------------

REM ----------------------------------------------------------------------------
:setsize
SET size=%~z1
GOTO :EOF
REM ----------------------------------------------------------------------------