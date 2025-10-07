; 反诈先锋游戏安装程序脚本
; 适用于Windows 7及以上系统

[Setup]
AppName=反诈先锋
AppVersion=2.0
AppPublisher=反诈先锋开发团队
AppPublisherURL=https://example.com
AppSupportURL=https://example.com/support
AppUpdatesURL=https://example.com/updates
DefaultDirName={pf}\反诈先锋
DefaultGroupName=反诈先锋
OutputDir=.
OutputBaseFilename=反诈先锋安装程序
SetupIconFile=assets\icons\app.ico
Compression=lzma2/max
SolidCompression=yes
WizardStyle=modern
PrivilegesRequired=lowest

[Languages]
Name: "chinese"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "desktopicon"; Description: "创建桌面快捷方式"; GroupDescription: "附加快捷方式:"
Name: "quicklaunchicon"; Description: "创建快速启动栏快捷方式"; GroupDescription: "附加快捷方式:"; Flags: unchecked

[Files]
; 主程序文件
Source: "desktop-version.html"; DestDir: "{app}"; Flags: ignoreversion
Source: "index.html"; DestDir: "{app}"; Flags: ignoreversion
Source: "game-enhanced.html"; DestDir: "{app}"; Flags: ignoreversion
Source: "start.bat"; DestDir: "{app}"; Flags: ignoreversion
Source: "manifest.json"; DestDir: "{app}"; Flags: ignoreversion

; CSS样式文件
Source: "css\*"; DestDir: "{app}\css"; Flags: ignoreversion recursesubdirs createallsubdirs

; JavaScript文件
Source: "js\*"; DestDir: "{app}\js"; Flags: ignoreversion recursesubdirs createallsubdirs

; 资源文件
Source: "assets\*"; DestDir: "{app}\assets"; Flags: ignoreversion recursesubdirs createallsubdirs

; 文档文件
Source: "使用说明.md"; DestDir: "{app}"; Flags: ignoreversion
Source: "启动指南.md"; DestDir: "{app}"; Flags: ignoreversion

[Icons]
Name: "{group}\反诈先锋"; Filename: "{app}\start.bat"; IconFilename: "{app}\assets\icons\app.ico"
Name: "{group}\卸载反诈先锋"; Filename: "{uninstallexe}"
Name: "{autodesktop}\反诈先锋"; Filename: "{app}\start.bat"; Tasks: desktopicon; IconFilename: "{app}\assets\icons\app.ico"
Name: "{userappdata}\Microsoft\Internet Explorer\Quick Launch\反诈先锋"; Filename: "{app}\start.bat"; Tasks: quicklaunchicon; IconFilename: "{app}\assets\icons\app.ico"

[Run]
Filename: "{app}\start.bat"; Description: "启动反诈先锋"; Flags: nowait postinstall skipifsilent

[UninstallDelete]
Type: filesandordirs; Name: "{app}"

[Code]
function InitializeSetup(): Boolean;
begin
  // 检查Windows版本
  if GetWindowsVersion < $06010000 then // Windows 7版本检查
  begin
    MsgBox('此程序需要Windows 7或更高版本。', mbError, MB_OK);
    Result := False;
  end
  else
    Result := True;
end;