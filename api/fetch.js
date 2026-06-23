/**
 * Vercel Serverless 订阅拉取代理
 * 部署: 把 api/ 目录放到 Vercel 项目根目录即可
 * 使用: https://your-project.vercel.app/api/fetch?url=订阅地址
 */

export default async function handler(req, res) {
    const { url, ua } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'Missing url parameter' });
    }

    const targetUrl = decodeURIComponent(url);
    const userAgent = ua || 'v2rayN/7.23';

    try {
        const response = await fetch(targetUrl, {
            headers: { 'User-Agent': userAgent },
            redirect: 'follow',
        });

        const body = await response.text();

        // 透传关键响应头
        const headers = {};
        const userInfo = response.headers.get('subscription-userinfo');
        if (userInfo) headers['subscription-userinfo'] = userInfo;
        headers['content-type'] = response.headers.get('content-type') || 'text/plain; charset=utf-8';
        headers['access-control-allow-origin'] = '*';

        res.writeHead(response.status, headers);
        res.end(body);
    } catch (e) {
        res.status(502).json({ error: 'Fetch failed', message: e.message });
    }
}