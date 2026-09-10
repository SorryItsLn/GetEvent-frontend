const API_URL = process.env.API_URL;

const api = { '/api': { target: API_URL, secure: false, changeOrigin: true, pathRewrite: { '^/api': '' }, logLevel: 'debug' } };

export default api;
