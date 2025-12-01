<#
.SYNOPSIS
  设置数据库自动备份的Windows任务计划
.DESCRIPTION
  该脚本用于创建一个每周运行的Windows任务计划，执行数据库备份脚本
.PARAMETER ScriptPath
  备份脚本的路径
.PARAMETER BackupTime
  备份时间，格式为 HH:mm
.PARAMETER BackupDay
  备份日期，可选值：Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday
.EXAMPLE
  .\setup-scheduled-task.ps1 -ScriptPath "d:\MyBlog\LoveandJoy\db-backup\backup-script.js" -BackupTime "02:00" -BackupDay "Sunday"
#>

param (
    [Parameter(Mandatory=$false)]
    [string]$ScriptPath = "d:\MyBlog\LoveandJoy\db-backup\backup-script.js",
    
    [Parameter(Mandatory=$false)]
    [string]$BackupTime = "02:00",
    
    [Parameter(Mandatory=$false)]
    [ValidateSet("Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday")]
    [string]$BackupDay = "Sunday"
)

# 检查脚本路径是否存在
if (-not (Test-Path $ScriptPath)) {
    Write-Error "备份脚本不存在: $ScriptPath"
    exit 1
}

# 任务名称
$TaskName = "数据库自动备份 - LoveandJoy"

# 任务描述
$TaskDescription = "每周自动备份LoveandJoy博客系统的MySQL数据库"

# 创建任务动作
$Action = New-ScheduledTaskAction -Execute "node.exe" -Argument $ScriptPath -WorkingDirectory (Split-Path $ScriptPath -Parent)

# 创建任务触发器
$Trigger = New-ScheduledTaskTrigger -Weekly -DaysOfWeek $BackupDay -At $BackupTime

# 创建任务设置
$Settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable -RestartCount 3 -RestartInterval (New-TimeSpan -Minutes 5)

# 注册任务
Register-ScheduledTask -TaskName $TaskName -Action $Action -Trigger $Trigger -Settings $Settings -Description $TaskDescription -User "SYSTEM" -RunLevel Highest

# 显示任务信息
Write-Host "✅ 任务计划创建成功！"
Write-Host "任务名称: $TaskName"
Write-Host "备份脚本: $ScriptPath"
Write-Host "备份时间: 每周 $BackupDay $BackupTime"
Write-Host "运行用户: SYSTEM"
Write-Host "运行级别: Highest"

# 测试任务
Write-Host "\n📋 测试任务是否可以正常运行..."
Start-ScheduledTask -TaskName $TaskName
Write-Host "✅ 任务已启动，正在后台运行..."
Write-Host "您可以通过任务计划程序查看任务运行状态和日志"

# 提示如何管理任务
Write-Host "\n📌 任务管理命令:"
Write-Host "  - 查看任务: Get-ScheduledTask -TaskName '$TaskName'"
Write-Host "  - 启动任务: Start-ScheduledTask -TaskName '$TaskName'"
Write-Host "  - 停止任务: Stop-ScheduledTask -TaskName '$TaskName'"
Write-Host "  - 删除任务: Unregister-ScheduledTask -TaskName '$TaskName' -Confirm:$false"
Write-Host "  - 查看任务历史: Get-WinEvent -LogName 'Microsoft-Windows-TaskScheduler/Operational' -FilterXPath "*[System[EventID=100 or EventID=101 or EventID=102 or EventID=200 or EventID=201]]" | Where-Object {$_.Properties[0].Value -eq '$TaskName'}"