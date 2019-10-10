# Rename Files By Nodejs & JSON

## Ⅰ.Usage

### 前提

电脑要安装了 [nodejs](https://nodejs.org/zh-cn/)，我的版本是 v10.16.3(LTS)，检查安装成功：命令行输入 `node -v` `npm -v` 显示版本号即为成功。

### 文件目录

```
│  content.json
│  index.js
│  package.json
│  README.md
│
├─don'tmove
│      123456789_10_0.txt
│      123456789_11_0.txt
│      123456789_1_0.txt
│      123456789_2_0.txt
│      123456789_3_0.txt
│      123456789_4_0.txt
│      123456789_5_0.txt
│      123456789_6_0.txt
│      123456789_7_0.txt
│      123456789_8_0.txt
│      123456789_9_0.txt
│
└─filesDir
```

`index.js` 为入口文件

`content.json` 为文件目录json文件

`don'tmove` 为样例目录，请勿移动或更改

`fileDir` 是要批量重命名文件的文件夹

### 测试或使用步骤

#### 测试时：

直接将 `don'tmove` 文件夹中的文件拷贝到 `fileDir` 文件夹中，命令行中输入 `npm start` ，即可观察到 `fileDir` 文件夹中文件名由 `123456789_x_0.txt` 变为 `xx-yyyy.txt` 。其中 `x` 代表数字， `yyyy` 代表名称。

#### 使用时：

1. 在网页欣赏B站视频时，鼠标右击查看源代码，<kbd>Ctrl</kbd>+<kbd>F</kbd> 找到视频目录部分，粘贴到 `content.json` 文件，具体样式如我的模板所示。
2. 将B站客户端下载的视频全部拷贝到 `fileDir` 文件夹下

PS.B站客户端下载的视频会在目录结构如下，在搜索框搜索 `.flv` ，然后按 <kbd>Ctrl</kbd>+<kbd>A</kbd> ， <kbd>Ctrl</kbd>+<kbd>C</kbd> ，到 `fileDir` 文件夹下  <kbd>Ctrl</kbd>+<kbd>V</kbd> 。
```
av号
│  
│  一些配置文件
│  cover.jpg
│
├─1
│      av号_1_0.flv
│      配置文件
├─2
│      av号_2_0.flv
│      配置文件
├─3
│      av号_3_0.flv
│      配置文件
│  
├      ...
│     
└─...
```

3. 修改 `index.js` 

按需将 `firstChange` 函数中的 av号 `123456789` 改为 所下载视频的 av号
```js
    let temp = item.replace("123456789_","")
    temp = temp.replace("_0","")
```

若不需要以下步骤的某一步，可以按需删除。
```js
firstChange()
secondChange()
thirdChange()
```

&hearts; 注意：执行后面一步之前，文件名必须已达到前一步执行后的文件名形式

## Ⅱ.Coding

### 初始化项目，新建文件夹 `filesDir` ，新建文件 `1.txt` ~ `11.txt`

```bash
# init
npm init
# New directory containing files need to be renamed
mkdir filesDir
# new files
for /l %b in (1 1 11) do md %%b
```

### `index.js`

1. 主要用到的函数： `fs.renameSync` 同步重命名函数

2. 读取文件名，前缀，后缀
```js
  let filesName = fs.readdirSync(filesPath)
  let filesNamePrefix = filesName.map((item,index) => {
    return item.substring(0,item.lastIndexOf("."))
  })
  let filesNameSuffix = filesName.map((item,index) => {
    return item.substring(item.lastIndexOf("."))
  })
```

3. 第一次替换，去冗余
```js
  let firstChangeFilesName = filesName.map((item,index) => {
    let temp = item.replace("123456789_","")
    temp = temp.replace("_0","")
    return temp
  })
```

4. 在1~9前面拼接字符串
```js
  if (filesNamePrefix[index]<10){
    let a = '0'
    let temp = a.concat(item)
    return temp
  }else{
    return item
  }
```

5. 读取json数据，拼接字符串
```js
  let jsonContent = fs.readFileSync(jsonPath)
  let contentObj = JSON.parse(jsonContent).map((item,index) => {
    let page = item.page<10?`0${item.page}`:item.page
    let part = item.part
    return `${page}-${part+filesNameSuffix[index]}`
  })
```

---

自己做的小项目，方便批量文件重命名
