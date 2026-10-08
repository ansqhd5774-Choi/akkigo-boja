import {readFileSync} from 'node:fs';
import {DOMParser} from '@xmldom/xmldom';
export function validateXml(text) {
  const issues=[];
  const document=new DOMParser({onError:(level,message)=>issues.push(`${level}: ${message}`)}).parseFromString(text,'application/xml');
  if(issues.length || document.documentElement?.tagName!=='html')throw Error('BLOGGER_XML_INVALID: '+issues.join('; '));
}
for(const path of ['theme/blogger-native-base.xml','akkigo_blogger_r1_bundle/theme/blogger-theme-r1.xml','akkigo_blogger_r1_bundle/theme/blogger-theme-r1_modified.xml']) {
  validateXml(readFileSync(path,'utf8'));console.log('XML_OK '+path);
}
