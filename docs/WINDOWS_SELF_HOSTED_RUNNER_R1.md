# 아끼고 보자 Windows 전용 러너 R1

## 설치와 격리

- 저장소: `ansqhd5774-Choi/akkigo-boja` (비공개)
- 러너: `akkigo-boja-runner`, 라벨: `self-hosted`, `Windows`, `X64`, `akkigo-boja`
- 설치: `C:\actions-runner-akkigo-boja`, 작업 폴더: `_work`
- 서비스 계정: `NT AUTHORITY\NETWORK SERVICE`
- 시작: Windows 서비스 자동 지연 시작, 실패 시 60초 후 재시작 3회
- 기존 `C:\actions-runner` 티스토리 러너와 예약 작업은 수정하지 않는다.

공식 GitHub 러너 ZIP을 다운로드하고 GitHub runner downloads API의 SHA-256과
일치하는지 확인한 후 설치한다. 관리자 CMD에서 Node로
`tools/runner/configure-windows-runner.mjs`를 실행한다. 설치 스크립트는 GH CLI의
현재 로그인 계정으로 해당 저장소에만 등록하며 등록 토큰을 자식 프로세스의
`ACTIONS_RUNNER_INPUT_TOKEN` 환경변수로 전달한다. 토큰을 파일이나 로그에
출력하지 않는다. 이미 등록된 러너를 자동 교체하지 않는다.

이 서비스 계정은 티스토리의 로그인 사용자와 분리되어 있다. GitHub Actions
setup-node와 pnpm/action-setup을 사용하므로 기존 사용자 전역 Node/pnpm 설정을
바꾸지 않는다. 워크플로 명령은 CMD와 Node로 실행한다. PowerShell/WSL 작업을
추가하지 않는다.

## 실행 계약

모든 저장소 워크플로는 전용 Windows 라벨만 사용한다. 오프라인이면 GitHub
대기열에 남으며 GitHub 호스팅 러너로 자동 대체하지 않는다. 요금제나 Cloudflare
한도 설정을 변경하지 않는다. 원본 텍스트는 `.gitattributes`의 LF 규칙으로
동일한 콘텐츠 해시를 유지한다.

발행은 같은 SHA의 reusable Verify를 먼저 완료한 후 실행한다. 단일 러너를
점유한 상태로 다른 Verify 실행을 기다리는 교착을 피한다. 기존 Push 범위
선택기, 승인 원고 검사, 중복 방지, Worker 소스 해시 preflight, D1 기록을
유지한다. pnpm은 작업별 격리 설치이며 XML 검사에도 사용한다. Worker build는
관련 소스 변경 또는 발행 사전 검사에만 실행한다.

실제 Worker 해시가 일치하면 재배포하지 않는다. 해시 불일치 시 기존 성공한
배포/발행 실행과 Git 조상을 확인한다. 수동 읽기 전용 probe는 배포 증거로
사용하지 않는다. 필요할 때만 migration과 배포를 실행하고 OIDC 토큰을
갱신한 뒤 정확한 원고 해시를 다시 확인한다. Blogger 변경은 마지막 단계에
한 번 수행하며 실패/timeout은 기존 Worker·D1 상태를 확인한 후 처리한다.

## 운영 검증

1. Verify workflow를 전용 러너에서 실행한다.
2. Publish Approved Article를 수동 실행한다. 기본 `readonly_probe=true`이다.
3. 이 경로는 원고 검사를 통과하는 기존 로얄 매치 글의 D1 SELECT와
   Blogger API GET을 수행한 뒤,
   실제 발행 클라이언트를 `requireUnchanged` 보호 조건으로 실행한다.
   본문이 동일한 LIVE 글만 무변경 결과를 반환한다. 본문이 다르거나 LIVE가
   아니면 변경 전에 중단한다. 새 글, 수정, 발행 시도 행, Worker 재배포를
   만들지 않는다. 테스트 요청 파일은 실행 후 제거하고 commit하지 않는다.
4. 결과는 `OIDC_WORKER_D1_BLOGGER_LIVE_PASS`와
   `UNCHANGED_PUBLISH_CLIENT_PASS` (`updated:false`)이다. 발행 응답의 postId와
   URL이 먼저 읽은 기존 LIVE 값과 정확히 같아야 한다. 시바 글은 기존 본문의
   중복 H1 때문에 최신 원고 검사에서 중단되므로 발행 테스트 대상으로 쓰지
   않으며 기존 글을 변경하거나 검사 기준을 완화하지 않는다.
5. 정상 발행 뒤 추가 브라우저 렌더 검사를 실행하지 않는다. UI 변경/오류의
   별도 Verify Blogger Layout 경로만 격리된 headless 프로필로 검사한다.

실제 PC 재부팅 시험은 작업 중인 사용자의 프로그램을 종료하므로 자동으로
수행하지 않는다. 재부팅 후 서비스 Running과 GitHub Online을 확인해야
재부팅 복구 검증 완료로 기록할 수 있다. 서비스 설정 확인이나 단순 재시작을
실제 재부팅 증거로 보고하지 않는다.

## 중단과 복구

러너가 오프라인이면 먼저 신규 서비스 상태와 비공개 `_diag`를 확인한다.
티스토리 러너나 인증 파일은 변경하지 않는다. 발행 실패 시 재발행 전에
Worker 응답, D1 상태, 기존 postId와 URL을 확인한다. 원고 차이/중복/권한
실패를 우회하지 않는다. 운영 글을 테스트 목적으로 생성하지 않는다.
