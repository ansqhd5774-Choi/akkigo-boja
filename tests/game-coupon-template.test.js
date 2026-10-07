import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

test('게임 쿠폰 공통 템플릿은 안전한 목록 요약과 표준 상세 구조를 유지한다',()=>{
  const html=readFileSync(new URL('../akkigo_blogger_r1_bundle/article/game-coupon-article-r1.html',import.meta.url),'utf8');
  const jump=html.indexOf('<!--more-->');
  assert.ok(jump>0);
  const preview=html.slice(0,jump);
  assert.match(preview,/data-ncp-feed-preview/);
  assert.match(preview,/\{\{ACTIVE_COUNT\}\}/);
  assert.match(preview,/\{\{PRIMARY_REWARD\}\}/);
  assert.match(preview,/\{\{EXPIRY_DISPLAY\}\}/);
  assert.equal(preview.includes('{{CODE}}'),false);
  assert.ok(html.indexOf('data-ncp-article="{{ARTICLE_KEY}}"')>jump);
  assert.match(html,/id="ncp-active"/);
  assert.ok(html.includes('data-ncp-app-icon="true"'));
  assert.ok(html.includes('data-ncp-featured-image="{{ARTICLE_KEY}}"'));
  assert.ok(html.includes('{{OFFICIAL_APP_ICON_URL}}'));
  assert.ok(html.includes('{{OFFICIAL_APP_STORE_URL}}'));
  assert.ok(html.includes('aspect-ratio:1/1;object-fit:contain'));
  assert.equal(html.includes('<h1'),false);

  assert.match(html,/현재 확인된 쿠폰/);
  assert.match(html,/id="ncp-expired"/);
  assert.match(html,/쿠폰 입력 방법/);
  assert.match(html,/쿠폰이 안 될 때 확인/);
  assert.match(html,/새 쿠폰 확인 방법/);
  assert.match(html,/관련 게임 쿠폰/);
  assert.match(html,/공식 출처/);
  assert.match(html,/자주 묻는 질문/);
  assert.doesNotMatch(html,/UNVERIFIED|verificationResult|evidenceMethod|validator|내부 운영 상태/);
});
