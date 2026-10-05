import {renderHub} from './coupons.js';

export const hubs = {
  zeus:'제우스: 오만의 신',
  lineagem:'리니지M',
  wuthering:'명조:워더링 웨이브'
};

const guides = {
  zeus:`<section><h2>쿠폰 입력 방법</h2><ol><li><a href="https://coupon.withhive.com/2352" rel="noopener noreferrer">제우스 공식 쿠폰 등록</a>을 엽니다.</li><li>사용 중인 서버를 선택하고 게임 설정에서 확인한 CS Code를 입력합니다.</li><li>보유한 쿠폰 번호를 입력한 뒤 등록합니다. 서버와 계정을 먼저 확인하세요.</li><li>게임 내 우편함에서 보상을 확인합니다. 네트워크 상태에 따라 지급이 지연될 수 있습니다.</li></ol><p>이미 사용한 쿠폰은 다시 등록할 수 없습니다. CS Code나 개인 쿠폰 번호를 댓글에 남기지 마세요.</p></section>`,
  lineagem:`<section><h2>쿠폰 입력 방법</h2><ol><li><a href="https://nshop.plaync.com/shop/lms/kr/coupon" rel="noopener noreferrer">리니지M 공식 쿠폰 등록</a>을 엽니다. 로그인하면 보유 캐릭터를 확인할 수 있습니다.</li><li>화면의 선택 항목과 닉네임을 확인하고 보유한 쿠폰 번호를 입력합니다.</li><li>등록 전 대상 캐릭터와 등록기한을 확인합니다.</li><li>등록 완료 후 게임 내 인벤토리에서 지급된 보상을 확인합니다.</li></ol><p>이미 사용한 쿠폰은 재등록할 수 없으며 계정당 종류별 한 개만 등록할 수 있습니다. 개인별 발급 쿠폰은 공용 코드와 구분하세요.</p></section>`,
  wuthering:`<section><h2>쿠폰 입력 안내</h2><p>현재 공식 근거로 확인한 입력 경로가 없습니다. 확인 전까지 메뉴 위치나 사용 가능한 코드를 안내하지 않습니다.</p><p><a href="https://wutheringwaves.kurogames.com/en/main" rel="noopener noreferrer">명조 공식 홈페이지</a>에서 공지와 고객지원을 확인하세요.</p></section>`
};

export function buildHubDraft(hubKey, coupons = []) {
  const brand=hubs[hubKey];
  if (!Object.hasOwn(hubs,hubKey)) throw new Error('UNKNOWN_HUB');
  return {
    title:`${brand} 쿠폰·입력 방법`,
    content:`<div data-ncp-hub="${hubKey}">${renderHub(brand,coupons)}${guides[hubKey]}<section><h2>쿠폰 확인 기준</h2><p>공식 출처, 적용 조건과 실제 사용 성공이 확인된 쿠폰만 표시합니다. 현재 목록에 없다는 것은 해당 게임의 모든 쿠폰이 없다는 뜻은 아닙니다.</p></section><p><a href="https://lsifl.blogspot.com/p/blog-page.html">개인정보 처리 안내</a></p></div>`,
    labels:['게임',brand]
  };
}
