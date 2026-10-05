# 수동 운영

프로젝트 루트에서 PowerShell로 실행한다. 인증정보는 로컬 `.admin-token`과 Wrangler 로그인만 사용하며 GitHub로 전송하지 않는다.

```powershell
./tools/manual-operations.ps1 -Action Status
./tools/manual-operations.ps1 -Action Collect
./tools/manual-operations.ps1 -Action Deploy
```

- Status: Worker 설정 상태를 확인한다. DB나 실제 수집 성공을 의미하지 않는다.
- Collect: 실제 원천 수집과 D1 저장을 1회 수행한다. 기록은 MANUAL이며 자연 Cron 실행으로 취급하지 않는다.
- Deploy: 기존 회귀 검사 통과 후 현재 로컬 소스를 배포한다. DB migration은 포함하지 않는다. 소스 변경 없이 동일 배포를 반복할 필요는 없다.
- 실패 또는 timeout: 기존 collection_runs/publish_attempts와 원격 배포 상태를 먼저 확인한다. 무조건 재실행하지 않는다.

GitHub Verify는 Actions에서 Run workflow로 수동 실행 가능하다. GitHub Deploy는 별도 Cloudflare credential 연결 전까지 비활성이다. 수동 CLI 배포는 그 인증정보 없이 기존 PC 로그인을 사용한다.
