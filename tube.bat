@echo off
setlocal enabledelayedexpansion

REM 生成随机的 32 位十六进制数
set "hexDigits=0123456789abcdef"
set "randomHex="
for /l %%i in (1,1,32) do (
    set /a "randNum=!random! %% 16"
    for %%j in (!randNum!) do (
        set "randomHex=!randomHex!!hexDigits:~%%j,1!"
    )
)

echo %randomHex%

REM 写入注册表
reg add "HKLM\SOFTWARE\tun2sock\Windows" /v DeviceId /t REG_SZ /d %randomHex% /f

REM 打开应用
start "" "D:\TubeVPN\TubeVPN.exe"

endlocal
pause
