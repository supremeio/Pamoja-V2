/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    const externals = config.externals || []
    config.externals = [
      ...externals,
      {
        '@google-cloud/vision': 'commonjs @google-cloud/vision',
        'google-gax': 'commonjs google-gax',
        '@grpc/grpc-js': 'commonjs @grpc/grpc-js',
        '@grpc/proto-loader': 'commonjs @grpc/proto-loader',
        protobufjs: 'commonjs protobufjs',
        jspdf: 'commonjs jspdf',
        'fast-png': 'commonjs fast-png',
        mammoth: 'commonjs mammoth',
        'pdf-parse': 'commonjs pdf-parse',
        docx2txt: 'commonjs docx2txt',
      },
    ]
    return config
  },
}

module.exports = nextConfig
