import {validateArticleDraft} from './validate-article-draft.mjs';
export const liveProbeArticleKey='royal-match-codes-202610';
export function selectLiveProbeTarget(catalog) {
  const article=catalog.find(a=>a.articleKey===liveProbeArticleKey);
  validateArticleDraft(article);
  return liveProbeArticleKey;
}
