'use strict'
var gulp = require('gulp');
var webpack = require('webpack');

// var Server = require('karma').Server;  //karma 前端自动化测试(单元测试)

//用于gulp传递参数
var minimist = require('minimist');

var gutil = require('gulp-util');

var assets = process.cwd() + '/dist';

var knownOptions = {
        string: 'env',
        default: {
                env: process.env.NODE_ENV || 'production'
        }
};

var options = minimist(process.argv.slice(2), knownOptions);


var remoteServer = { //正式服务器相关信息
        host: '192.168.56.129',
        remotePath: '/data/website/website1',
        user: 'root',
        pass: 'password',
        port: 22
};

var localServer = { //测试服务器相关信息
        host: '10.10.10.141',
        remotePath: '/home/rt/mafront/application/prize',
        user: 'root',
        pass: 'Rtmap2018',
        port: 22
}

/**
 * karma 前端自动化测试
 */

// gulp.task('test',function(done){
//         new Server({
//                 configFile : __dirname + '/karma.conf.js' , 
//                 singleRun : true 
//         } , done).start();
// });


/*
上传文件
 */

gulp.task('deploy', function () {
        var sftp = require('gulp-sftp');
        var _conf = options.env === 'production' ? remoteServer : localServer;
        return gulp.src(assets + '/**').pipe(sftp(_conf));
})
