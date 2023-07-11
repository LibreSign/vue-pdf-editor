# xcc-pdf-editor

- power by vue2
- thanks https://github.com/ShizukuIchi/pdf-editor
- thanks https://github.com/ndinhquan1998/vue-pdf-editor-module

# npm
https://www.npmjs.com/package/xcc-pdf-editor

# DEMO

[xcc-pdf-editor](https://llanc.github.io/xcc-pdf-editor/)

# 使用
- package.json添加依赖并安装 / npm i xcc-pdf-editor
- 解压node_modules中xcc-pdf-editor下的xcc-pdf-editor.7z到项目根目录的public下，xcc-pdf-editor.7z中为资源文件。
- main.js 引入并 Vue.use
- Webpack配置中指定makeTextPDF.min.js的加载器为file-loader
``` js
    {
          test: /makeTextPDF\.min\.js$/,
          loader: 'file-loader'
    }
```

## eg
```vue
    <XccPdfEditor
    width="100%" <!--组件尺寸 默认100%-->
    height="100%" <!--组件尺寸 默认100%-->
    :show-choose-file-btn="true"  <!--展示文件选择按钮 默认false-->
    :show-customize-editor="true"  <!--展示自定义编辑栏目 默认true-->
    :show-customize-editor-add-text="true" <!--添加文本 默认true-->
    :show-customize-editor-add-img="true"  <!--添加图片 默认true-->
    :show-customize-editor-add-draw="true"  <!--添加笔迹 默认true-->
    :show-line-size-select = 'false' <!--行间距选择 默认true-->
    :show-font-size-select= 'false' <!--字号选择 默认true-->
    :show-font-select="false"   <!--字体选择 默认true-->
    :show-rename="true"   <!--展示重命名栏 默认true-->
    :show-save-btn="false"  <!--展示保存按钮 默认true-->
    :save-to-upload="true"  <!--false 直接下载; true 触发onSave2Upload事件 默认false->
    :init-file-src="'【pdf url】'"   <!--初始化文件地址-->
    :init-file-name="initFileName" <!--初始化文件名称-->
    :init-text-fields = "【text array】"  <!--初始化文本数组-->
    :init-image-urls = "【image url array】"   <!--初始化图片数组-->
    :init-image-scale = "0.2" <!--初始化图片的缩放级别 默认原尺寸的 0.2倍-->
    :seal-image-show="true" <!--是否展示签章示例 默认false-->
    :seal-image-hidden-on-save="true" <!--签章示例在保存时是否隐藏 默认false-->
    @onSave2Upload="【save callback】"  <!--保存回调 载荷为：pdfBytes 和 fileName-->
    >
    </XccPdfEditor>

```
