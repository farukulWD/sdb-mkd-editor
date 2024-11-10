const removeImports = require('next-remove-imports')();

const nextConfig = {
  transpilePackages: [
    '@mdxeditor/editor',
    'antd',
    '@ant-design/icons',
    '@ant-design/icons-svg',
    '@antv/g2',            
    '@antv/g-base',        
    'd3-interpolate' 
  ],
  experimental: {
    esmExternals: 'loose',
  },
  webpack: (config) => {
    config.experiments = { ...config.experiments, topLevelAwait: true };
    return config;
  }
};


module.exports = removeImports(nextConfig);