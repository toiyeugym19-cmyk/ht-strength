---
description: Tự động kích hoạt build iOS trên GitHub và tải file IPA về máy
---

// turbo-all
1. Kích hoạt Github Actions build file IPA:
```powershell
$cred = ("protocol=https`r`nhost=github.com`r`n`r`n" | git credential fill)
$password = ($cred | Where-Object { $_ -match "password=" }) -replace "password=", ""
$env:GH_TOKEN = $password
gh workflow run build-ios.yml --ref master
```

2. Theo dõi tiến trình và tải file về máy khi hoàn tất:
```powershell
Start-Sleep -Seconds 10
$cred = ("protocol=https`r`nhost=github.com`r`n`r`n" | git credential fill)
$password = ($cred | Where-Object { $_ -match "password=" }) -replace "password=", ""
$env:GH_TOKEN = $password
$runId = (gh run list --workflow build-ios.yml --limit 1 --json databaseId | ConvertFrom-Json).databaseId
Write-Host "Đang theo dõi build ID: $runId (Bạn vui lòng chờ khoảng 3-4 phút...)"
gh run watch $runId
gh run download $runId -n HT-Strength-IPA -D $env:USERPROFILE\Downloads
Write-Host "✅ HOÀN TẤT! Đã tải file HT-Strength-ESign.ipa về thư mục Downloads!"
```
