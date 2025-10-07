@echo off
title 反诈先锋安装包构建工具
chcp 65001 >nul

echo.
echo ========================================
echo       反诈先锋安装包构建工具
echo ========================================
echo.

echo 此脚本将指导您如何构建Windows安装包
echo.

echo 步骤1：准备必要的文件
echo 正在复制游戏文件到安装包目录...

REM 创建必要的目录结构
if not exist "dist" mkdir dist
if not exist "dist\css" mkdir dist\css
if not exist "dist\js" mkdir dist\js
if not exist "dist\assets" mkdir dist\assets
if not exist "dist\assets\icons" mkdir dist\assets\icons

REM 复制核心文件
copy "..\desktop-version.html" "dist\" >nul
copy "..\index.html" "dist\" >nul
copy "..\game-enhanced.html" "dist\" >nul
copy "..\manifest.json" "dist\" >nul
copy "start-game.bat" "dist\" >nul
copy "..\使用说明.md" "dist\" >nul
copy "..\启动指南.md" "dist\" >nul

REM 复制CSS文件
xcopy "..\css\*" "dist\css\" /Y /I >nul

REM 复制JS文件
xcopy "..\js\*" "dist\js\" /Y /I >nul

REM 复制资源文件
xcopy "..\assets\*" "dist\assets\" /Y /I /E >nul

echo 文件复制完成！
echo.

echo 步骤2：构建安装包
echo.
echo 注意：要构建安装包，您需要安装Inno Setup工具
echo.
echo 请按以下步骤操作：
echo 1. 下载并安装Inno Setup（免费软件）
echo    下载地址：https://jrsoftware.org/isdl.php
echo 2. 安装完成后，右键点击installer.iss文件
echo 3. 选择"Compile"编译安装脚本
echo 4. 生成的安装程序将在当前目录中
echo.

echo 如果您没有Inno Setup，可以使用以下替代方案：
echo 1. 将"dist"文件夹打包为ZIP文件
echo 2. 用户解压后运行start-game.bat即可
echo.

echo 构建完成！安装包文件位于dist文件夹中
echo.
pause