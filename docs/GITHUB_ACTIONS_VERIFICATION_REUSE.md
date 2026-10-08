# Actions 검증 재사용 및 아이콘 일괄 검사

- Verify는 Windows/Node 24에서 테스트, Worker dry-run build, 테마 재생성 clean diff, XML 검사를 모두 실행한다. 비 Worker 변경에서도 재사용 가능한 빌드 증거를 만든다.
- Deploy/Publish는 현재 SHA와 정확히 일치하는 성공한 standalone Verify만 재사용한다. 대상 저장소/브랜치와 실행 종류, 최신 attempt의 모든 필수 step 성공을 확인한다. PR 실행, skipped build, 누락된 검사는 재사용하지 않는다.
- API 조회 실패, 아직 실행 중, 결과 없음은 실패로 위장하지 않고 현재 job에서 전체 검사를 실행한다. 단일 러너를 점유한 채 다른 Verify를 기다리지 않는다.
- Publish의 별도 source-verify job을 제거했다. 재사용하지 못하면 같은 job에서 검사한 후 발행한다. 복구 배포가 필요하면 의존성 설치는 최대 한 번 수행한다.
- Worker 재배포 판정, OIDC, D1 migration, 정확한 Worker source 확인, Blogger LIVE/URL 검사와 중복 발행 방지는 유지한다. Deploy/Publish는 production-worker FIFO queue 및 cancel-in-progress:false를 유지한다.
- Verify Game Icons를 workflow_dispatch로 실행한다. games 입력은 aqualand, cat-gunner, dokkaebi-world, duck, outerplane, rogw, royal-kingdom, top-lords, aniimo, top-force 중 하나 또는 쉼표로 구분한 여러 ID이다. all은 10개 전체 검사다. 중복 ID는 한 번만 실행하며 알 수 없는 ID는 작업 실행 전에 거부한다.
- 기존 10개 게임별 workflow를 공통 workflow 1개로 통합했다. 기존 공식 원천 검사 스크립트는 유지하고 같은 job에서 순서대로 실행한다. 중간 실패 시 다음 검사는 실행하지 않는다.
- 다른 SHA는 재사용하지 않는다. 동일 SHA 재사용 비율과 실제 작업시간에 따라 절감량이 달라진다. 셀프 호스팅 러너만 사용하며 호스팅 러너로 자동 대체하지 않는다.
