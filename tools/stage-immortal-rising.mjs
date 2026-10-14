import {readFileSync,writeFileSync} from 'node:fs';
import {renderGamePeriodArticle,GAME_PERIOD_VERSION} from '../src/game-period-article.js';

const KEY='immortal-rising-awakening-202610';
const TITLE='이모탈 라이징: 불멸의 각성';
const checkedAt='2026-10-14';
const store='https://apps.apple.com/kr/app/id6795748071';
const googlePlay='https://play.google.com/store/apps/details?id=com.hkgt.mot.kr.gp';
const officialSite='https://immortalrising.goatgames.com/';
const naver='https://game.naver.com/lounge/Immortal_Rising_Awakening/home';
const facebook='https://www.facebook.com/ImmortalRising.Awakening';
const instagram='https://www.instagram.com/immortalrisingawakening/';
const gcoupon='https://gcouponplay.com/immortal-rising-coupon/';
const hiki='https://www.hiki-trivia.com/2026/09/sss-1.html';
const gameedu='https://game.edu.kg/ko/%EC%9D%B4%EB%AA%A8%ED%83%88-%EB%9D%BC%EC%9D%B4%EC%A7%95%3A-%EB%B6%88%EB%A9%B8%EC%9D%98-%EA%B0%81%EC%84%B1/%EC%BF%A0%ED%8F%B0/';
const linegames='https://www.linegames.org/ko/%EC%9D%B4%EB%AA%A8%ED%83%88-%EB%9D%BC%EC%9D%B4%EC%A7%95%3A-%EB%B6%88%EB%A9%B8%EC%9D%98-%EA%B0%81%EC%84%B1-%EC%BF%A0%ED%8F%B0/';
const modelPath='data/immortal-rising-awakening-202610.json';
const model=JSON.parse(readFileSync(modelPath,'utf8'));

const officialCodes=['IMNAVER','IMMORTAL24','LUCKY666','VIP777','VIP888','moon','GUIDE0924'];
if(model.articleKey!==KEY)throw Error('IMMORTAL_INPUT_KEY_INVALID');
if(model.records.length!==7||new Set(model.records.map(x=>x.code)).size!==7||officialCodes.some(code=>!model.records.some(x=>x.code===code)))throw Error('IMMORTAL_BASE_HISTORY_INVALID');

model.title=TITLE;
for(const record of model.records){
  record.status='UNVERIFIED';
  record.statusLabel='공식 채널 게시 추적 · 현재 입력 성공 미확인';
  record.latest=true;
  record.latestEvidence=`2026-10-14 재조사에서 네이버 라운지·공식 Facebook/Instagram에 연결된 2차 대조 자료가 ${record.code}를 2026-09-24 운영진 공개 코드로 계속 기록한다. 개별 공식 원문 URL과 현재 계정 입력 성공은 독립 확인하지 못했다.`;
}

const third=(name,url,sourcePublishedAt,updatedAt)=>({
  name,
  url,
  referenceType:'THIRD_PARTY_CODE_MENTION',
  sourcePublishedAt,
  updatedAt,
  checkedAt
});
const addCandidate=({code,origin,url,sourcePublishedAt,updatedAt,latest=true,statusLabel})=>{
  if(model.records.some(x=>x.code===code))return;
  model.records.push({
    code,
    sourcePublishedAt,
    expiry:latest?'미확인':'현재 출처 페이지 미노출',
    latest,
    status:'UNVERIFIED',
    statusLabel,
    latestEvidence:latest
      ?`${checkedAt} 확인 시 ${origin}의 ${TITLE} 전용 페이지에 ${code}가 노출됐다. 해당 출처는 게임 운영사와 무관하며 공식 발급 원문·실제 계정 입력 성공·정확한 만료는 확인되지 않았다.`
      :`${checkedAt} 현재 직접 확인한 페이지에는 ${code}가 보이지 않지만 검색 색인의 이전 스냅샷에 노출 기록이 있어 과거 제3자 후보로 보존한다.`,
    sources:[third(`${origin} · ${TITLE} 코드 목록`,url,sourcePublishedAt,updatedAt)],
    evidenceHTML:latest
      ?`<p>${origin}의 ${TITLE} 전용 코드 목록에서 확인했습니다. 이 출처는 게임 운영사와 무관하다고 명시하므로 공식 쿠폰으로 승격하지 않습니다. 페이지 게시일은 출처 페이지의 게시일이며 코드 발급일을 뜻하지 않습니다. 실제 계정 입력 성공은 확인하지 못했습니다.</p>`
      :`<p>검색 색인의 이전 스냅샷에서 ${origin} 페이지에 노출된 기록을 확인했지만 ${checkedAt} 직접 조회한 현재 페이지에는 보이지 않습니다. 삭제하지 않고 과거 제3자 미확인 후보로만 보존합니다.</p>`
  });
};

for(const code of ['GAMEEDU','VIP555','VIP666','VIP999','GO2024','FBGIFT']){
  addCandidate({code,origin:'GameEDU',url:gameedu,sourcePublishedAt:'2026-07-14',updatedAt:'2026-10-14',statusLabel:'제3자 현재 후보 · 범용형 문자열 · 공식 발급 미확인'});
}
for(const code of ['LINEGAMES','WELCOME','VIP222','VIP555','VIP2024','FBGIFT']){
  addCandidate({code,origin:'LINEGames',url:linegames,sourcePublishedAt:'2026-04-10',updatedAt:'2026-10-14',statusLabel:'제3자 현재 후보 · 범용형 문자열 · 공식 발급 미확인'});
}
addCandidate({code:'VIP111',origin:'LINEGames 검색 색인',url:linegames,sourcePublishedAt:'2026-04-10',updatedAt:'2026-10-03',latest:false,statusLabel:'과거 제3자 후보 · 현재 페이지 미노출 · 공식 발급 미확인'});

if(model.records.length!==18||new Set(model.records.map(x=>x.code)).size!==18)throw Error('IMMORTAL_REFRESH_RECORD_COUNT_INVALID');
const latestCount=model.records.filter(x=>x.latest).length;
if(latestCount!==17)throw Error('IMMORTAL_REFRESH_LATEST_COUNT_INVALID');

model.previewHTML=`<div class="ncp-feed-preview" data-ncp-feed-preview="data-ncp-feed-preview" aria-label="${TITLE} 쿠폰 요약"><div class="ncp-feed-stat"><span>현재 입력 후보</span><strong>${latestCount}개</strong></div><div class="ncp-feed-stat"><span>공식 채널 게시 추적</span><strong>7개</strong></div><div class="ncp-feed-stat"><span>전체 보존 기록</span><strong>${model.records.length}개</strong></div></div>`;
model.noticeHTML=`<p>2026년 10월 14일 다시 확인했습니다. Google Play와 App Store의 현재 공식 게임명은 <strong>${TITLE}</strong>이며 Android 패키지는 <strong>com.hkgt.mot.kr.gp</strong>, iOS 앱 ID는 <strong>6795748071</strong>입니다. Google Play는 공식 네이버 라운지·Instagram·Discord·YouTube·Facebook을 공식 커뮤니티로 연결하고 있습니다.</p><p>기존 7개(IMNAVER · IMMORTAL24 · LUCKY666 · VIP777 · VIP888 · moon · GUIDE0924)는 2026-09-24 운영진 공개 코드로 복수 자료가 대조하지만, 이번 조사에서도 개별 공식 원문 URL과 현재 계정 입력 성공을 독립 확인하지 못했습니다. 따라서 <strong>공식 채널 게시 추적·현재 입력 성공 미확인</strong>으로 유지합니다.</p><p>GameEDU와 LINEGames가 현재 추가로 노출하는 범용형 문자열은 운영사 공식 코드로 승격하지 않고 <strong>제3자 미확인 입력 후보</strong>로 보존합니다. 두 페이지는 게임 운영사와 무관하다고 직접 명시합니다. 출처 접근·문자열 발견과 실제 사용 성공은 별개입니다.</p>`;
model.guideHTML=`<section class="ncp-coupon-guide"><h2>${TITLE} 쿠폰 입력 방법</h2><ol><li>공식 앱 <strong>${TITLE}</strong>에 로그인합니다.</li><li>게임 메인 화면 왼쪽 위 <strong>프로필(아바타)</strong>을 누릅니다.</li><li>캐릭터 정보 창 아래 <strong>교환 코드</strong> 메뉴를 선택합니다.</li><li>코드를 정확히 붙여 넣고 확인한 뒤 <strong>게임 우편함</strong>을 확인합니다.</li></ol><p><strong>moon</strong>은 확인 자료에서 소문자로 기록되어 있으므로 그대로 입력하세요. 사용 기간·계정 상태·서버·중복 등록 여부에 따라 실패할 수 있습니다.</p><h2>추가 쿠폰 찾는 곳</h2><p><a href="${naver}" rel="noopener noreferrer">공식 네이버 라운지</a> · <a href="${facebook}" rel="noopener noreferrer">공식 Facebook</a> · <a href="${instagram}" rel="noopener noreferrer">공식 Instagram</a></p><h2>채팅방 전용 코드</h2><p>공식 카카오톡 채팅방 전용 코드가 있다는 제3자 안내는 확인되지만 공개 문자열은 확보하지 못했습니다. 문자열을 추정해 만들지 않습니다.</p><h2>확인 기준</h2><p>공식 채널에 게시됐다는 근거, 제3자 페이지에 문자열이 있다는 사실, 현재 계정에서 실제 지급에 성공했다는 사실을 분리합니다. 이 글의 현재 후보는 입력 시도 대상이며 모두의 계정에서 성공한다고 보장하지 않습니다.</p></section>`;
model.archiveHTML=`<section><h2>원문·보조 자료</h2><p>${checkedAt} 조사 기준입니다. 원문 최초 게시일이 확인된 기존 7개는 2026-09-24로 유지하며, 제3자 후보의 날짜는 해당 제3자 페이지 게시일입니다. 수집일을 발급일로 바꾸지 않았습니다.</p><ul><li><a href="${googlePlay}" rel="noopener noreferrer">Google Play 공식 앱</a></li><li><a href="${store}" rel="noopener noreferrer">Apple App Store 공식 앱</a></li><li><a href="${officialSite}" rel="noopener noreferrer">GOAT Games 공식 게임 홈페이지</a></li><li><a href="${naver}" rel="noopener noreferrer">공식 네이버 라운지</a></li><li><a href="${gcoupon}" rel="noopener noreferrer">지쿠폰플레이 · 7개 코드와 운영진 게시 시각 대조</a></li><li><a href="${hiki}" rel="noopener noreferrer">히키 트리비아 · 공식 SNS·라운지 7개 교차 확인</a></li><li><a href="${gameedu}" rel="noopener noreferrer">GameEDU · 제3자 후보 목록</a></li><li><a href="${linegames}" rel="noopener noreferrer">LINEGames · 제3자 후보 목록</a></li></ul></section>`;

const response=await fetch('https://itunes.apple.com/lookup?id=6795748071&country=kr',{signal:AbortSignal.timeout(25000)});
if(!response.ok)throw Error('OFFICIAL_STORE_LOOKUP_'+response.status);
const details=(await response.json()).results?.find(x=>x.trackId===6795748071);
if(!details||details.trackName!==TITLE||!details.artworkUrl512)throw Error('WRONG_OFFICIAL_APP');
const iconUrl=details.artworkUrl512.replace(/^http:/,'https:');
if(new URL(iconUrl).hostname!=='is1-ssl.mzstatic.com')throw Error('STORE_ICON_DOMAIN_INVALID');
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('"','&quot;');
const link=esc(store);
model.featuredHTML='<figure data-ncp-featured-image="'+KEY+'" data-ncp-app-icon="true" data-ncp-app-icon-source="'+link+'"><a href="'+link+'" rel="noopener noreferrer"><img src="'+esc(iconUrl)+'" width="512" height="512" alt="'+TITLE+' 공식 앱 아이콘" loading="eager" decoding="async" style="display:block;width:512px;height:auto;max-width:100%;aspect-ratio:1/1;object-fit:contain"/></a><figcaption>GOAT Games App Store 공식 아이콘</figcaption></figure>';

const icons=JSON.parse(readFileSync('data/game-app-icons.json','utf8'));
const existing=icons.find(x=>x.articleKey===KEY);
const entry={articleKey:KEY,gameName:TITLE,platform:'apple-app-store',appStoreUrl:store,iconUrl,iconShape:'square',verifiedDate:checkedAt};
if(existing)Object.assign(existing,entry);else icons.push(entry);
writeFileSync('data/game-app-icons.json',JSON.stringify(icons,null,2)+'\n');
writeFileSync(modelPath,JSON.stringify(model,null,2)+'\n');

const records=JSON.parse(readFileSync('data/game-period-articles.json','utf8'));
const old=records.find(x=>x.articleKey===KEY);
if(old)Object.assign(old,model);else records.push(model);
writeFileSync('data/game-period-articles.json',JSON.stringify(records,null,2)+'\n');

const catPath='data/articles-supplemental.json';
const cat=JSON.parse(readFileSync(catPath,'utf8'));
const article={
  articleKey:KEY,
  approvedForPublish:true,
  post:{title:model.title,content:renderGamePeriodArticle(model),labels:['게임','이모탈라이징',TITLE]},
  source:{
    type:'IMMORTAL_RISING_AWAKENING_GLOBAL_CROSSCHECK',
    url:googlePlay,
    checkedAt,
    references:[googlePlay,store,officialSite,naver,facebook,instagram,gcoupon,hiki,gameedu,linegames],
    presentationVersion:'compact-r2',
    templateVersion:GAME_PERIOD_VERSION,
    gamePeriodModel:model,
    searchDescription:`${TITLE} 쿠폰을 2026년 10월 14일 기준 재조사했습니다. 공식 채널 게시 추적 코드 7개와 제3자 입력 후보를 출처별로 구분하고 입력 방법과 현재 확인 상태를 정리합니다.`,
    keywords:['이모탈 라이징 쿠폰','이모탈 라이징 불멸의 각성 쿠폰','이모탈 라이징 쿠폰 2026','이모탈 라이징 10월 쿠폰','이모탈 라이징 교환 코드','IMMORTAL24','GUIDE0924','Immortal Rising Awakening redeem code'],
    hashtags:['#이모탈라이징','#불멸의각성','#이모탈라이징쿠폰','#게임쿠폰','#쿠폰코드','#ImmortalRising','#RedeemCode'],
    searchMeasurement:{status:'NOT_MEASURED'},
    officialDistributionCandidates:officialCodes,
    unverifiedCandidates:model.records.filter(x=>x.status==='UNVERIFIED').map(({code,sourcePublishedAt,latest,latestEvidence,expiry,status,sources})=>({code,sourcePublishedAt,latest,latestEvidence,expiry,status,sources})),
    historicalRecords:model.records.filter(x=>!x.latest).map(({code,sourcePublishedAt,latest,latestEvidence,expiry,status,sources})=>({code,sourcePublishedAt,latest,latestEvidence,expiry,status,sources})),
    benefits:[]
  }
};
if(JSON.parse(readFileSync('data/articles.json','utf8')).some(a=>a.articleKey===KEY))throw Error('ARTICLE_ALREADY_EXISTS_PRIMARY');
const index=cat.findIndex(a=>a.articleKey===KEY);
if(index===-1)cat.push(article);else cat[index]=article;
const {validateGameFeaturedImage}=await import('../src/game-featured-image-policy.js');
validateGameFeaturedImage(KEY,article.post);
writeFileSync(catPath,JSON.stringify(cat,null,2)+'\n');
console.log('IMMORTAL_STAGE_READY',{articleKey:KEY,title:TITLE,records:model.records.length,latest:latestCount,officialTraced:officialCodes.length,iconStore:'apple-app-store',catalog:cat.length});
