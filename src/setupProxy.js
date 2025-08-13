const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://universeexchapi.com',
      changeOrigin: true,
      secure: false,
      // No pathRewrite needed - we want to keep the original path
      onProxyReq: function(proxyReq, req, res) {
        console.log('Proxying:', req.method, req.url, '->', proxyReq.path);
      },
      onError: function(err, req, res) {
        console.error('Proxy error:', err);
      }
    })
  );
};
