@echo off
setlocal EnableExtensions
set "BLOG_ID=2339978524893611480"
set "PORT=9231"
set "PROFILE=%LOCALAPPDATA%\akkigo-boja\blogger-theme-profile"
set "EDITOR_URL=https://draft.blogger.com/blog/themes/edit/%BLOG_ID%"
set "CHROME="

if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" set "CHROME=%ProgramFiles%\Google\Chrome\Application\chrome.exe"
if not defined CHROME if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" set "CHROME=%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"
if not defined CHROME if exist "%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe" set "CHROME=%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"

if not defined CHROME (
  echo BLOGGER_CHROME_NOT_FOUND
  exit /b 1
)

if not exist "%PROFILE%" mkdir "%PROFILE%" >nul 2>nul

echo BLOGGER_PROFILE=%PROFILE%
echo BLOGGER_CDP_URL=http://127.0.0.1:%PORT%
start "AKKIGO Blogger Theme" "%CHROME%" --remote-debugging-port=%PORT% --user-data-dir="%PROFILE%" --no-first-run --no-default-browser-check "%EDITOR_URL%"

echo.
echo Google/Blogger official page is open in the dedicated AKKIGO profile.
echo If a Google sign-in page appears, complete sign-in in that Chrome window.
echo Do not paste passwords or OTP codes into chat.
echo.
echo After the Blogger HTML editor is visible, return here and press any key.
pause >nul

set "BLOGGER_CDP_URL=http://127.0.0.1:%PORT%"
node tools\apply-blogger-theme-patch-via-cdp.mjs --sync-source
if errorlevel 1 (
  echo BLOGGER_THEME_DRY_RUN_FAILED
  exit /b 1
)

node tools\apply-blogger-theme-patch-via-cdp.mjs --sync-source --apply
if errorlevel 1 (
  echo BLOGGER_THEME_APPLY_FAILED
  exit /b 1
)

echo BLOGGER_THEME_APPLY_COMPLETED
exit /b 0
