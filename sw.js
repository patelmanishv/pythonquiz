const resources = ["https://quizgenerator.net/quizgen5.16.18/basic/photoswipe/default-skin/default-skin.png","https://quizgenerator.net/quizgen5.16.18/basic/photoswipe/default-skin/default-skin.svg","https://quizgenerator.net/quizgen5.16.18/basic/photoswipe/default-skin/preloader.gif","https://quizgenerator.net/quizgen5.16.18/basic/get.mp3","https://quizgenerator.net/quizgen5.16.18/basic/move.mp3","https://quizgenerator.net/quizgen5.16.18/basic/koke.mp3","https://quizgenerator.net/quizgen5.16.18/basic/js/mdb.js"];
const cacheName = 'quizgen-cache-v1';

const deleteCaches = async () => {
  const keys = await caches.keys();
  return Promise.all(keys.map((key) => {
    return caches.delete(key);
  }));
}

const cacheResponse = async (requestUrl, response, cache) => {
  // レスポンスが200番台でない場合はキャッシュせずに終了
  if (!response.ok) {
    return;
  }
  if (response.status !== 206) {
    return cache.put(requestUrl, response.clone());
  }

  // status 206 Partial Contentの場合
  // フルサイズでないレスポンスの場合はキャッシュせずに終了
  if (!isFullSizeRangeResponse(response.clone())) {
    console.log(`Precache failed. Partial content cannnot be cached. Request URL: ${requestUrl}`);
    return;
  }
  // 動画や音声の場合にFireFoxだとstatus 206のRange Responseが返ってくることがあるが、そのままキャッシュしようとするとCashe APIの仕様上エラーとなる
  // データとしては完全なデータが返ってきているのでstatus 200の通常のResponseに置換してキャッシュ
  const blob = await response.blob();
  const newResponse = new Response(blob, {status: 200, statusText: 'OK', headers: response.headers});
  return cache.put(requestUrl, newResponse.clone());
}

const precacheResources = async () => {
  const cache = await caches.open(cacheName);
  return Promise.all(resources.map(async (resource) => {
    const response = await fetch(resource);
    return cacheResponse(resource, response, cache);
  }));
}

const isFullSizeRangeResponse = (response) => {
  if (response.status !== 206) {
    return false;
  }
  const contentRangeHeader = response.headers.get('Content-Range');
  if (!contentRangeHeader) {
    return false;
  }
  const contentRangeParts = /(\d*)-(\d*)\/(\d*)/.exec(contentRangeHeader);
  if (!contentRangeParts[1] || !contentRangeParts[2] || !contentRangeParts[3]) {
    return false;
  }
  return +contentRangeParts[3] === +contentRangeParts[2] - contentRangeParts[1] + 1;
}

const handleRequest = async (request) => {
  const cache = await caches.open(cacheName);
  const cachedResponse = (await cache.match(request.url)) ?? (await cache.match(decodeURI(request.url)));
  if (!cachedResponse) {
    // キャッシュヒットしない場合はネットワークから返す
    return fetch(request);
  }
  if (request.headers.get('range')) {
    return createPartialResponse(request.clone(), cachedResponse.clone());
  }
  return cachedResponse;
}

// ref: https://github.com/GoogleChrome/workbox/tree/v6/packages/workbox-range-requests
const createPartialResponse = async (request, originalResponse) => {
  try {
    if (originalResponse.status === 206) {
      return originalResponse;
    }
    const rangeHeader = request.headers.get('range');
    if (!rangeHeader) {
      throw new Error('no-range-header');
    }
    const boundaries = parseRangeHeader(rangeHeader);
    const originalBlob = await originalResponse.blob();
    const effectiveBoundaries = calculateEffectiveBoundaries(originalBlob, boundaries.start, boundaries.end);
    const slicedBlob = originalBlob.slice(effectiveBoundaries.start, effectiveBoundaries.end);
    const slicedBlobSize = slicedBlob.size;
    const slicedResponse = new Response(slicedBlob, {
      // Status code 206 is for a Partial Content response.
      // See https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/206
      status: 206,
      statusText: 'Partial Content',
      headers: originalResponse.headers,
    });
    slicedResponse.headers.set('Content-Length', String(slicedBlobSize));
    slicedResponse.headers.set('Content-Range', `bytes ${effectiveBoundaries.start}-${effectiveBoundaries.end - 1}/${originalBlob.size}`);
    return slicedResponse;
  } catch (error) {
    return new Response('', {
      status: 416,
      statusText: 'Range Not Satisfiable',
    });
  }
}

const parseRangeHeader = (rangeHeader) => {
  const normalizedRangeHeader = rangeHeader.trim().toLowerCase();
  const rangeParts = /(\d*)-(\d*)/.exec(normalizedRangeHeader);
  if (!rangeParts || !(rangeParts[1] || rangeParts[2])) {
    throw new Error('invalid-range-values');
  }
  return {
    start: rangeParts[1] === '' ? undefined : Number(rangeParts[1]),
    end: rangeParts[2] === '' ? undefined : Number(rangeParts[2]),
  };
}

const calculateEffectiveBoundaries = (blob, start, end) => {
  const blobSize = blob.size;
  if ((end && end > blobSize) || (start && start < 0)) {
    throw new Error('range-not-satisfiable');
  }
  let effectiveStart;
  let effectiveEnd;
  if (start !== undefined && end !== undefined) {
    effectiveStart = start;
    // Range values are inclusive, so add 1 to the value.
    effectiveEnd = end + 1;
  } else if (start !== undefined && end === undefined) {
    effectiveStart = start;
    effectiveEnd = blobSize;
  } else if (end !== undefined && start === undefined) {
    effectiveStart = blobSize - end;
    effectiveEnd = blobSize;
  }
  return {
    start: effectiveStart,
    end: effectiveEnd,
  };
}

self.addEventListener('install', async (event) => {
  self.skipWaiting();
  // キャッシュを一旦削除してからキャッシュを追加
  await deleteCaches();
  await precacheResources();
  console.log('Precache process finished.');
});

self.addEventListener('activate', async (event) => {
  await clients.claim();
});

// リクエストを監視
self.addEventListener('fetch', async (event) => {
  if (event.request.method === 'GET') {
    event.respondWith(handleRequest(event.request));
  }
});
