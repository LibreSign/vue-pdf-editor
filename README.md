# xcc-pdf-editor

- power by vue2
- thanks https://github.com/ShizukuIchi/pdf-editor
- thanks https://github.com/ndinhquan1998/vue-pdf-editor-module

# 使用
- package.json添加依赖并安装
- 复制node_modules中xcc-pdf-editor下的public下的xcc-pdf-editor文件价到项目根目录的public下



## eg
```vue
    <XccPdfEditor
    :show-choose-file-btn="true"  <!--展示文件选择按钮-->
    :show-customize-editor="true"  <!--展示自定义编辑栏目-->
    :show-rename="true"   <!--展示重命名栏-->
    :show-save-btn="false"  <!--展示保存按钮-->
    :load-default-file="false"    <!--加载组件内置实例pdf-->
    :init-file-src="'【pdf url】'"   <!--初始化文件地址-->
    :init-file-name="initFileName" <!--初始化文件名称-->
    :init-text-fields = "【text array】"  <!--初始化文本数组-->
    :init-image-urls = "【image url array】"   <!--初始化图片数组-->
    :save-to-upload="true"  <!--false 直接下载; true 触发onSave2Upload事件 ->
    @onSave2Upload="【save callback】"  <!--保存回调 载荷为：pdfBytes 和 fileName-->
>
</XccPdfEditor>
```
