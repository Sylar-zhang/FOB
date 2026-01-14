/* sw.js */
// 每次修改 HTML/CSS 后，必须修改这里的版本号 (v2 -> v3 -> v4...)
const CACHE_NAME = 'fob-calc-v3'; 

const ASSETS = [
  './',
  './index.html',
  './manifest.json'
  // 注意：如果你没有上传 icon 图片，请把 icon 的行删掉，否则会导致整个缓存失败！
  // './icon-192.png', 
];

// 1. 安装阶段：强制跳过等待
self.addEventListener('install', (e) => {
  self.skipWaiting(); // <--- 【关键】不等旧版本退休，直接插队
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// 2. 激活阶段：立即接管页面 & 清理旧缓存
self.addEventListener('activate', (e) => {
  e.waitUntil(
    Promise.all([
      clients.claim(), // <--- 【关键】立即控制当前打开的页面
      // 清理旧版本缓存
      caches.keys().then((keys) => {
        return Promise.all(
          keys.map((key) => {
            if (key !== CACHE_NAME) {
              console.log('删除旧缓存:', key);
              return caches.delete(key);
            }
          })
        );
      })
    ])
  );
});

// 3. 拦截请求
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
});
