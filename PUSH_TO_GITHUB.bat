@echo off
echo Đang đẩy mã nguồn lên GitHub...
git add .
git commit -m "feat: redesign Knowledge page to digital library style"
git push origin replit-push-v1 --force
echo.
echo HOÀN THÀNH! Anh hãy vào link này để lấy code cho Replit:
echo https://github.com/toiyeugym19-cmyk/ht-strength/tree/replit-push-v1
pause
