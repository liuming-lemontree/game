#!/bin/bash

echo "正在启动《反诈先锋》游戏服务器..."
echo ""
echo "游戏将在以下地址运行:"
echo "http://localhost:8000"
echo ""
echo "测试页面地址:"
echo "http://localhost:8000/test.html"
echo ""
echo "按 Ctrl+C 可以停止服务器"
echo ""

cd "$(dirname "$0")"
python3 -m http.server 8000