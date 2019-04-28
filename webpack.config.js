/*
 * @Author: Yzed 
 * @Date: 2019-02-17 14:38:40 
 * @Last Modified by: Yzed
 * @Last Modified time: 2019-04-26 18:28:06
 */

const path = require('path')
const ExtractTextPlugin   = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const webpack = require('webpack')

//环境变量配置
let WEBPACK_ENV = process.env.WEBPACK_ENV || 'dev'
//获取html-webpack-plugin参数的方法
const getHtmlConfig = function(name,title){
    return {
        template: `./src/view/${name}.html`,
        filename: `view/${name}.html`,
        favicon: './favicon.ico',
        title: title,
        inject: true,
        hash: true,
        chunks: ['common',name]
    }
}

//webpack配置
const config = {
    mode : 'dev' === WEBPACK_ENV ? 'development' : 'production',
    entry: {
        'common'            : './src/page/common/common',
        'index'             : './src/page/index/index',
    },
    output: {
        publicPath  : 'dev' === WEBPACK_ENV ? '/dist/' : '/dist/',
        filename: 'js/[name].bundle.js',
        chunkFilename: 'js/[name].chunk.js'
    },
    devtool: 'source-map',
    devServer: {
        port: 8088,
        overlay: true,
        inline: true,
        //解决跨域问题
        // proxy : {
        //     '**/*.do' : {
        //         target: '',
        //         changeOrigin : true
        //     }
        // }
    },
    externals: {
        'jquery': 'window.jQuery'
    },
    resolve: {
        alias: {
            node_modules    : __dirname + '/node_modules',
            util: __dirname + '/src/util',
            page: __dirname + '/src/page',
            service: __dirname + '/src/service',
            image: __dirname + '/src/image'
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/, // 针对js结尾的文件设置LOADER
                use: {
                    loader: 'babel-loader'
                },
                include: [path.resolve(__dirname,'./src')],
                exclude: '/node_modules/'
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            },
            // 模板文件的处理
            {
                test: /\.string$/,
                use: {
                    loader: 'html-loader',
                    options: {
                        minimize : true,
                        removeAttributeQuotes : false
                    }
                }
            },
            // 图片的配置
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 2048,
                            name: 'resource/[name].[ext]'
                        }
                    }
                ]
            },
            // 字体图标的配置
            {
                test: /\.(eot|svg|ttf|woff|woff2|otf)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                            name: 'resource/[name].[ext]'
                        }
                    }
                ]
            }
        ]
    },
    optimization: {
        runtimeChunk: false,
        splitChunks: {
            cacheGroups: {
                common: {
                    name: "common",
                    chunks: "all",
                    minChunks: 2
                }
            }
        }
    },
    plugins: [
        //清理dist
        new CleanWebpackPlugin(['dist']),
        // 把css单独打包到文件里
        new ExtractTextPlugin("css/[name].css"),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
        //html模板的处理
        new HtmlWebpackPlugin(
            getHtmlConfig('index', '首页')
        )
    ]
}

module.exports = config