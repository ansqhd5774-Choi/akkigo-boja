import periodModels from '../data/game-period-hubs.json' with {type:'json'};
import {renderGamePeriodArticle} from './game-period-article.js';
export const hubs={zeus:'제우스: 오만의 신',lineagem:'리니지M',wuthering:'명조:워더링 웨이브'};
export function buildHubDraft(hubKey,coupons=[],now=Date.now()){
 if(!Object.hasOwn(hubs,hubKey))throw Error('UNKNOWN_HUB');
 const model=periodModels[hubKey];
 if(!model)throw Error('GAME_PERIOD_MODEL_REQUIRED');
 return {title:hubs[hubKey],content:renderGamePeriodArticle(model).replace('<article ','<article data-ncp-hub="'+hubKey+'" '),labels:['게임',hubs[hubKey]]};
}