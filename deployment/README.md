# ciic-core


## 开发(贡献) 

1.每次修改任何东西需要升级版本

```
npm version patch   //修改bug  1.0.0 -> 1.0.1
 
npm version  minor  //功能增加、变更 1.0.0 -> 1.1.0

npm version major   //架构更改，不兼容之前版本  1.0.0 -> 2.0.0
```

2.修改 所有的API 文档，变更或者新增的地方填入对应的版本

3.修改CHANGELOG.md 变更记录

4.打包命令：

```
//编译开发的包到项目下，需要修改gulpfile.js文件中的devPath，开发项目路径。
npm run dev


//编译正式包
npm run deploy 


//手动发布
cd deployment 
npm publish --access public

```


