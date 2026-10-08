# Actions 검증 재사용 및 아이콘 일괄 검사

- Verify는 Windows/Node 24에서 테스트, Worker dry-run build, 테마 재생성 clean diff, XML 검사를 모두 실행한다. 비 Worker 변경에서도 재사용 가능한 빌드 증거를 만든다.
- Deploy/Publish는 현재 SHA와 정확히 일치하는 성공한 standalone Verify만 재사용한다. 대상 저장소/브랜치와 실행 종류, 최신 attempt의 모든 필수 step 성공과 검증 인증서(Node 실제 버전, pnpm 버전, lockfile SHA-256, OS/아키텍처, 검사 규칙 버전)를 확인한다. PR 실행, skipped build, 누락된 검사는 재사용하지 않는다.
- API 조회 실패, 아직 실행 중, 결과 없음은 실패로 위장하지 않고 현재 job에서 전체 검사를 실행한다. 단일 러너를 점유한 채 다른 Verify를 기다리지 않는다.
- Publish의 별도 source-verify job을 제거했다. 재사용하지 못하면 같은 job에서 검사한 후 발행한다. 복구 배포가 필요하면 의존성 설치는 최대 한 번 수행한다.
- Worker 재배포 판정, OIDC, D1 migration, 정확한 Worker source 확인, Blogger LIVE/URL 검사와 중복 발행 방지는 유지한다. Deploy/Publish는 production-worker FIFO queue 및 cancel-in-progress:false를 유지한다.
- Verify Game Icons를 workflow_dispatch로 실행한다. games 입력은 aqualand, cat-gunner, dokkaebi-world, duck, outerplane, rogw, royal-kingdom, top-lords, aniimo, top-force 중 하나 또는 쉼표로 구분한 여러 ID이다. all은 10개 전체 검사다. 중복 ID는 한 번만 실행하며 알 수 없는 ID는 작업 실행 전에 거부한다.
- 기존 10개 게임별 workflow를 공통 workflow 1개로 통합했다. 기존 공식 원천 검사 스크립트는 유지하고 같은 job에서 순서대로 실행한다. 일부 실패 시 나머지도 검사하며 마지막에 전체 결과를 출력하고 실패 상태로 종료한다. 게임별 최대 120초 제한을 둔다.
- 자동 Deploy는 push로 동시에 시작하지 않고 신뢰하는 브랜치의 Verify 성공 후 workflow_run으로 시작한다. 검증 SHA/checkout SHA/현재 원격 HEAD/GitHub 실행 SHA 불일치는 배포 전에 중단한다. 수동 Deploy는 검증 재사용 또는 전체 검사 경로를 유지한다.
- 승인된 발행 요청의 기존 push 범위 선택과 발행 전 필요 배포 경로는 유지한다. 자동 Deploy 완료를 기다리느라 러너를 점유하지 않는다. Publish가 먼저 실행되어도 필요한 배포와 Worker source 확인 후에만 Blogger를 변경한다.
- 검증 조회는 모든 API 요청에 공유하는 전체 15초 제한을 적용한다. 조회 실패 시 전체 검사로 전환한다. Deploy/Publish summary에는 재사용 사유, 예약한 전체 검사/설치 횟수, 배포 필요 여부, 작업 상태를 기록하며 실제 단계 결과는 job timeline으로 확인한다.
- Verify의 사용하지 않는 Worker 변경 감지 단계는 제거했다.
- 다른 SHA는 재사용하지 않는다. 동일 SHA 재사용 비율과 실제 작업시간에 따라 절감량이 달라진다. 셀프 호스팅 러너만 사용하며 호스팅 러너로 자동 대체하지 않는다.
