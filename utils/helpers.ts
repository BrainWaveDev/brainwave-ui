import {
  CancelSubscriptionRequest,
  CreateSubscriptionRequest
} from '@/types/products';

const dev = process.env.NODE_ENV !== 'production';

export const getURL = () => {
  let url = dev
    ? 'http://localhost:3000/'
    : process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
      'http://localhost:3000/';
  // Make sure to include `https://` when not localhost.
  url = url.includes('http') ? url : `https://${url}`;
  // Make sure to including trailing `/`.
  url = url.charAt(url.length - 1) === '/' ? url : `${url}/`;
  return url;
};

export const postData = async ({
  url,
  data,
  requestType
}: {
  url: string;
  data?: CreateSubscriptionRequest | CancelSubscriptionRequest;
  requestType: 'create' | 'cancel';
}) => {
  console.log('posting,', url, data);

  const res: Response = await fetch(url, {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json',
      Type: requestType
    }),
    credentials: 'same-origin',
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    console.error('Error in postData', { url, data, res });
    throw Error(res.statusText);
  }

  return res.json();
};

export const toDateTime = (secs: number) => {
  var t = new Date('1970-01-01T00:30:00Z'); // Unix epoch start.
  t.setSeconds(secs);
  return t;
};

export function wait(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): T {
  let lastFunc: ReturnType<typeof setTimeout>;
  let lastRan: number;

  return ((...args) => {
    if (!lastRan) {
      func(...args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        if (Date.now() - lastRan >= limit) {
          func(...args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  }) as T;
}
