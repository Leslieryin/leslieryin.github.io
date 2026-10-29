// 校验站点：head 元信息、锚点自洽、外链可达、预览图尺寸、404 页存在
import { readFileSync, existsSync } from 'node:fs';

const SITE = 'https://leslieryin.github.io/';
const errors = [];
const ok = [];

const html = readFileSync('index.html', 'utf8');
const notFound = readFileSync('404.html', 'utf8');

// 1. 必备元信息
const required = [
  ['lang', /<html lang="zh-CN">/],
  ['<title>', /<title>[^<]{4,}<\/title>/],
  ['meta description', /<meta name="description" content="[^"]{20,}">/],
  ['canonical', /<link rel="canonical" href="https:\/\/leslieryin\.github\.io\/">/],
  ['og:title', /<meta property="og:title" content="[^"]+">/],
  ['og:image', /<meta property="og:image" content="[^"]+">/],
  ['og:image:width', /<meta property="og:image:width" content="1280">/],
  ['og:image:height', /<meta property="og:image:height" content="640">/],
  ['twitter:card', /<meta name="twitter:card" content="summary_large_image">/],
  ['favicon', /<link rel="icon" href="data:image\/svg\+xml,/],
];
for (const [name, re] of required) {
  if (re.test(html)) ok.push(`meta ${name}`);
  else errors.push(`首页缺少 ${name}`);
}

// 2. 锚点自洽：仓库 About 里的 website 直接用这些锚点，改名时必须同步
const expectedAnchors = [
  'windows-disk-cleanup',
  'bili-watcher',
  'photo-cleanup-pipeline',
  'windows-healthcheck',
  '8086-microcomputer-lab',
  'database-course-design',
  'awesome-automation-zh',
  'comfyui-teaching-kit',
];
const ids = new Set([...html.matchAll(/id="([^"]+)"/g)].map((m) => m[1]));
for (const a of expectedAnchors) {
  if (!ids.has(a)) errors.push(`锚点 #${a} 缺失（仓库 About 的链接会跳空）`);
}
if (expectedAnchors.every((a) => ids.has(a))) ok.push(`仓库锚点 ${expectedAnchors.length} 个全部命中`);

// 页内锚点链接也要能自洽
const anchors = [...html.matchAll(/href="(?:https:\/\/leslieryin\.github\.io\/)?#([^"]+)"/g)].map((m) => m[1]);
for (const a of new Set(anchors)) {
  if (!ids.has(a)) errors.push(`页内锚点 #${a} 在首页找不到对应 id`);
}

// 3. 预览图存在且尺寸正确
const og = readFileSync('assets/og.png');
if (og.readUInt32BE(16) === 1280 && og.readUInt32BE(20) === 640) ok.push('og.png 1280×640');
else errors.push(`og.png 尺寸不对：${og.readUInt32BE(16)}×${og.readUInt32BE(20)}`);

// 4. 404 页存在且能回到首页
if (existsSync('404.html') && notFound.includes(SITE)) ok.push('404.html 可回首页');
else errors.push('404.html 缺失或没有回首页的链接');

// 5. 不引入外部资源（站点承诺零外部请求）
const external = [...html.matchAll(/<(?:script|link|img)[^>]+(?:src|href)="(https?:[^"]+)"/g)]
  .map((m) => m[1])
  .filter((u) => !u.startsWith(SITE) && !u.startsWith('data:'));
if (external.length) errors.push(`首页引用了外部资源：${external.join(', ')}`);
else ok.push('零外部资源引用');

// 6. 四台实验台线上可达（GitHub Pages 偶发抖动，重试 3 次）
const labs = [
  'control-lab',
  'modern-control-lab',
  'process-control-lab',
  '8086-emulator-lab',
];
for (const lab of labs) {
  const url = `${SITE}${lab}/`;
  let status = 0;
  for (let i = 0; i < 3; i++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
      status = res.status;
      if (status === 200) break;
    } catch {
      status = 0;
    }
    if (i < 2) await new Promise((r) => setTimeout(r, 2000));
  }
  if (status === 200) ok.push(`${lab} 200`);
  else errors.push(`${lab} 不可达（最后状态 ${status}）`);
}

for (const line of ok) console.log(`OK   ${line}`);
if (errors.length) {
  for (const line of errors) console.log(`FAIL ${line}`);
  console.error(`\n${errors.length} 项检查失败`);
  process.exit(1);
}
console.log('\n站点检查全部通过');
