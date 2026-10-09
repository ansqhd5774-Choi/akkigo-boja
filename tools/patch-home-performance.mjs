import {readFileSync,writeFileSync} from 'node:fs';
const [input,output]=process.argv.slice(2);
if(!input||!output)throw Error('THEME_INPUT_OUTPUT_REQUIRED');
let xml=readFileSync(input,'utf8');
const start=xml.indexOf('// Home R4:');
const end=xml.indexOf('//]]></script>',start);
if(start<0||end<0)throw Error('HOME_SCRIPT_MISSING');
xml=xml.slice(0,start)+readFileSync('theme/home-r4.js','utf8')+'\n'+xml.slice(end);
const hero='https://akkigo-boja.ansqhd5774.workers.dev/home-hero.webp';
if(xml.includes(hero)&&!xml.includes("rel='preload' as='image' href='"+hero)){
 xml=xml.replace('</head>',"<b:if cond='data:view.isHomepage'><link rel='preload' as='image' href='"+hero+"' type='image/webp' fetchpriority='high'/></b:if>\n</head>");
}
writeFileSync(output,xml);
