@echo off
title 反诈先锋游戏启动器
chcp 65001 >nul

echo.
echo ========================================
echo           反诈先锋游戏启动器
echo ========================================
echo.

echo 正在检查系统环境...

REM 检查Python是否安装
python --version >nul 2>&1
if errorlevel 1 (
    echo 错误：未检测到Python环境！
    echo 请确保已安装Python 3.6或更高版本
    echo.
    echo 可以从以下地址下载Python：
    echo https://www.python.org/downloads/
    echo.
    pause
    exit /b 1
)

echo 检测到Python环境，正在启动游戏服务器...
echo.
echo 游戏将在以下地址运行：
echo http://localhost:8000/desktop-version.html
echo.
echo 按 Ctrl+C 可以停止服务器
echo.

REM 切换到脚本所在目录
cd /d "%~dp0"

REM 启动HTTP服务器
echo 正在启动游戏服务器...
python -m http.server 8000

if errorlevel 1 (
    echo.
    echo 启动失败！可能的原因：
    echo 1. 端口8000已被占用
    echo 2. 防火墙阻止了访问
    echo 3. Python环境异常
    echo.
    echo 请尝试以下解决方案：
    echo 1. 关闭其他占用8000端口的程序
    echo 2. 以管理员身份运行此脚本
    echo 3. 检查Python安装
    echo.
    pause
)

pause