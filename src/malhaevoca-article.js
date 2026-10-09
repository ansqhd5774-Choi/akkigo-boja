import research from '../data/malhaevoca-offers-202610.json' with {type:'json'};
const KEY='malhaevoca-discounts-202610';
const esc=v=>String(v??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const offers=research.offers;
if(offers.length!==4||new Set(offers.map(o=>o.id)).size!==4||offers.some(o=>o.code!==null))throw Error('MALHAEVOCA_RESEARCH_INVALID');
const formattedDate=o=>o.sourcePublishedAt?o.sourcePublishedAt.replaceAll('-','.'):'원문 게시일 미확인';
const formattedPrice=o=>Number.isFinite(o.priceKRW)?o.priceKRW.toLocaleString('ko-KR')+'원':o.discountLabel;
const row=o=>'<tr><td><strong>'+esc(o.name)+'</strong></td><td>'+esc(formattedPrice(o))+'</td><td>'+esc(formattedDate(o))+'</td><td>'+esc(o.eligibility)+'</td><td><a href="'+esc(o.sourceUrl)+'" rel="noopener noreferrer">공식 조건 보기</a></td></tr>';
const preview='<div class="ncp-feed-preview" data-ncp-feed-preview="true" aria-label="말해보카 공식 할인 요약"><div class="ncp-feed-stat"><span>공식 웹결제 12개월</span><strong>99,000원</strong></div><div class="ncp-feed-stat"><span>나라사랑카드 12개월</span><strong>69,000원</strong></div><div class="ncp-feed-stat"><span>학생 무료 혜택</span><strong>선착순·자격 조건</strong></div></div>';
const css='<style>'
+'[data-ncp-article="'+KEY+'"]{font:15px/1.7 Arial,"Noto Sans KR",sans-serif;max-width:100%;color:#172033;overflow-wrap:anywhere}'
+'[data-ncp-article="'+KEY+'"] *{box-sizing:border-box}'
+'[data-ncp-article="'+KEY+'"] h1{font-size:25px;line-height:1.35;margin:12px 0}'
+'[data-ncp-article="'+KEY+'"] h2{font-size:20px;line-height:1.4;margin:28px 0 10px}'
+'[data-ncp-article="'+KEY+'"] p{margin:8px 0 14px}'
+'[data-ncp-article="'+KEY+'"] .ncp-mal-hero{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px;margin:16px 0}'
+'[data-ncp-article="'+KEY+'"] .ncp-mal-hero>div{border:1px solid #e3d8f4;border-radius:11px;padding:13px;background:#fbf8ff}'
+'[data-ncp-article="'+KEY+'"] .ncp-mal-hero strong{display:block;color:#6325b2;font-size:21px}'
+'[data-ncp-article="'+KEY+'"] .ncp-mal-hero small{display:block;color:#586578;font-size:12px}'
+'[data-ncp-article="'+KEY+'"] .ncp-mal-tip{border-left:3px solid #7041c5;background:#f7f3ff;padding:13px;margin:14px 0}'
+'[data-ncp-article="'+KEY+'"] .ncp-mal-scroll{overflow-x:auto}'
+'[data-ncp-article="'+KEY+'"] table{border-collapse:collapse;width:100%;min-width:560px;font-size:13px}'
+'[data-ncp-article="'+KEY+'"] th,[data-ncp-article="'+KEY+'"] td{border-bottom:1px solid #e4e8f0;padding:11px 9px;text-align:left;vertical-align:top}'
+'[data-ncp-article="'+KEY+'"] th{background:#f3f0fa;font-weight:700}'
+'[data-ncp-article="'+KEY+'"] th:nth-child(1){width:115px}[data-ncp-article="'+KEY+'"] th:nth-child(2){width:100px}[data-ncp-article="'+KEY+'"] th:nth-child(3){width:88px}[data-ncp-article="'+KEY+'"] th:nth-child(5){width:100px}'
+'[data-ncp-article="'+KEY+'"] a{color:#5428bd;font-weight:600}'
+'[data-ncp-article="'+KEY+'"] ul,[data-ncp-article="'+KEY+'"] ol{padding-left:20px}'
+'@media(max-width:600px){[data-ncp-article="'+KEY+'"]{font-size:14px}[data-ncp-article="'+KEY+'"] h1{font-size:21px}[data-ncp-article="'+KEY+'"] h2{font-size:18px}[data-ncp-article="'+KEY+'"] .ncp-mal-hero{grid-template-columns:1fr}[data-ncp-article="'+KEY+'"] .ncp-mal-hero strong{font-size:19px}}'
+'</style>';
const html=preview+'\n<!--more-->\n<article data-ncp-article="'+KEY+'" class="ncp-coupon-article">'+css
+'<figure data-ncp-featured-image="'+KEY+'" style="margin:0 auto 20px;text-align:center"><a href="https://epop.ai/ko" rel="noopener noreferrer"><img src="https://epop.ai/og-image.jpg" data-ncp-brand-logo="true" alt="말해보카 공식 웹사이트 대표 이미지" width="1200" height="630" loading="eager" decoding="async" style="display:block;width:100%;max-width:520px;height:auto;object-fit:contain;margin:auto"/></a><figcaption>이팝소프트 말해보카 공식 사이트</figcaption></figure>'
+'<h1>말해보카 할인 2026년 10월 | 1년 가격·나라사랑카드·학생 무료 이벤트</h1>'
+'<p>2026년 10월 10일 기준, 말해보카 공식 사이트와 제휴사 공지를 대조한 할인 경로를 정리했습니다. 현재 누구나 입력할 수 있는 공식 공용 쿠폰 문자열은 확보되지 않았습니다. <strong>즉시할인·카드할인·학생 혜택은 입력코드가 아닌 결제 경로별 프로모션</strong>입니다.</p>'
+'<div class="ncp-mal-hero"><div><small>일반 이용자 · 웹결제</small><strong>99,000원/년</strong></div><div><small>하나 나라사랑카드 회원</small><strong>69,000원/년</strong></div><div><small>중·고등학생</small><strong>무료 이용 기회</strong></div></div>'
+'<h2>말해보카 공식 할인 4가지 비교</h2>'
+'<div class="ncp-mal-scroll"><table><thead><tr><th>공식 혜택</th><th>가격·할인</th><th>출처 게시일</th><th>이용 조건</th><th>공식 링크</th></tr></thead><tbody>'+offers.map(row).join('')+'</tbody></table></div>'
+'<h2>1. 일반 이용자: 웹결제 연 99,000원</h2>'
+'<p>공식 멤버십 페이지에 1인 12개월 정상가 234,000원, 할인가 119,000원, <strong>웹결제 시 추가 20,000원 할인</strong>을 안내하여 최종 99,000원으로 표시합니다. 표시 금액은 확인한 공식 페이지 기준이며 결제 직전 상품과 실제 청구액을 대조하세요. '+link('https://epop.ai/ko/premium','말해보카 공식 12개월 웹결제')+'</p>'
+'<h2>2. 하나 나라사랑카드: 연 69,000원</h2>'
+'<p>이팝소프트가 2026년 1월 20일 발표한 제휴 할인입니다. 지정된 <strong>하나 나라사랑카드(체크)</strong>로 공식 이벤트 페이지에서 결제하면 12개월 69,000원으로 안내합니다. 행사기간은 2026년 1월 1일~12월 31일이며 인당 연 1회가 원칙입니다. 단순히 군인이거나 다른 나라사랑카드 소지자라는 이유로 적용된다고 보장하지 않습니다. '+link('https://epop.ai/event/hana-nara-card','카드 전용 공식 행사')+' · '+link('https://epop.ai/newsroom/49','2026-01-20 공식 발표')+'</p>'
+'<h2>3. 중·고등학생: 주간 무료 이용 이벤트</h2>'
+'<p>공식 프로모션에는 <strong>2008~2013년생</strong> 대상, 매주 일요일 오후 9시 10분 신규 150명 선착순 모집으로 기재돼 있습니다. 본인 명의 휴대전화 인증과 카카오 계정 연동이 필요하고, 주간 학생 리그 상위 50%를 유지해야 다음 주 무료 이용이 이어집니다. 기존 멤버십 이용자는 종료 이후 참여 가능합니다. 모집 인원·자격은 신청 직전에 다시 확인하세요. '+link('https://epop.ai/promotion/middle-high-school','중·고등학생 공식 무료 신청')+'</p>'
+'<h2>4. 대학생·대학원생: 톡학생증 제휴</h2>'
+'<p>카카오는 2024년 6월 19일 <strong>12개월 프리미엄 30% 할인</strong>을 소개했습니다. 다만 이 자료만으로 2026년 10월에도 같은 할인액이 적용된다고 판단하지 않습니다. 카카오톡 지갑 톡학생증 인증 후 현재 제휴 혜택과 최종 결제액을 확인하세요. '+link('https://www.kakaocorp.com/page/detail/11098','카카오 공식 톡학생증 혜택 발표')+'</p>'
+'<p class="ncp-mal-tip"><strong>주의:</strong> 서로 다른 할인 경로의 가격을 중복 적용하거나, 예전 2인·4인 요금제와 현재 신규 요금을 혼용하지 않습니다. 같은 연간 이용권 기준으로 가입 자격, 결제 수단, 자동 갱신, 환불 조건을 확인하세요.</p>'
+'<h2>할인 받는 방법</h2><ol><li>내가 대상인 경로(일반 웹결제·하나 나라사랑카드·학생)를 선택합니다.</li><li>위 공식 페이지에서 이용 자격·기간·요금제를 확인합니다.</li><li>최종 결제금액과 갱신·해지 조건을 확인한 뒤 결제합니다.</li><li>앱의 멤버십 상태와 유료 기간이 표시되는지 확인합니다.</li></ol>'
+'<h2>쿠폰 코드가 따로 있나요?</h2><p>이번 조사에서 <strong>모든 한국 계정에 공통 적용된다는 공식 문자 코드</strong>를 발견하지 못했습니다. 위 혜택은 대부분 공식 페이지 전용 할인이므로 입력할 코드가 없는 것이 정상입니다. 실제 문자열과 공식 발급 근거를 확보하면 별도 항목에 출처 글 작성 날짜와 함께 추가할 수 있습니다.</p>'
+'<h2>출처·날짜</h2><p>2026년 1월 20일은 나라사랑카드 공식 발표일, 2024년 6월 19일은 톡학생증 소개 글의 작성일입니다. 게시일이 표기되지 않은 상시 혜택은 임의로 2026년 10월 발행일을 지정하지 않았습니다. 말해보카 앱 공식 스토어: '+link('https://apps.apple.com/kr/app/id1460766549','Apple App Store')+'. 검색량·노출률은 실측되지 않아 근거 없는 인기 순위를 제시하지 않습니다.</p>'
+'</article>';
function link(url,text){return '<a href="'+url+'" rel="noopener noreferrer">'+text+'</a>';}
export const malhaevocaArticle={
 articleKey:KEY,approvedForPublish:true,publicationStatus:'READY',
 post:{title:'말해보카 할인 2026년 10월 | 1년 가격·나라사랑카드·학생 무료 이벤트',labels:['교육','말해보카'],content:html},
 source:{type:'MALHAEVOCA_OFFICIAL_OFFERS_202610',url:'https://epop.ai/ko/premium',checkedAt:'2026-10-10',
 status:'UNVERIFIED',codes:[],offers:research.offers.map(x=>({id:x.id,sourcePublishedAt:x.sourcePublishedAt,dateBasis:x.dateBasis,status:x.status})),
 searchDescription:research.seo.description,keywords:research.seo.keywords,hashtags:research.seo.hashtags,
 references:research.sourcesReviewed}
};