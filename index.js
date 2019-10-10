const fs = require('fs')
const filesPath = './filesDir/'
const jsonPath = './content.json'


// 同步重命名函数，参数oldPath,newPath都是数组对象
const rename = (oldPath,newPath) => {
  if(oldPath.length === newPath.length){
    oldPath.map((item,index) => {
      fs.renameSync(filesPath+item, filesPath+newPath[index], (err) => {
        if (err) {
          throw err
        }
      })
    })
  }else{
    console.log("oldPath's length & newPath's length is not equal !!! Please check again !!! ")
  }
}


// 读取文件名，前缀，后缀(.xxx)
const getOldName = () => {
  let filesName = fs.readdirSync(filesPath)
  let filesNamePrefix = filesName.map((item,index) => {
    return item.substring(0,item.lastIndexOf("."))
  })
  let filesNameSuffix = filesName.map((item,index) => {
    return item.substring(item.lastIndexOf("."))
  })
  let oldName = {filesName,filesNamePrefix,filesNameSuffix}
  // console.log(oldName)
  return oldName
}


// 第一次改变，将B站视频av名("123456789_")剔除，将多余部分("_0")剔除
const firstChange = () => {
  let {filesName,filesNamePrefix,filesNameSuffix} = getOldName()
  let firstChangeFilesName = filesName.map((item,index) => {
    let temp = item.replace("123456789_","")
    temp = temp.replace("_0","")
    return temp
  })
  console.log('firstChangeFilesName:'+firstChangeFilesName)
  rename(filesName,firstChangeFilesName)
}


// 第二次改变，将1~9改名为01~09，避免后面排序错误
const secondChange = () => {
  let {filesName,filesNamePrefix,filesNameSuffix} = getOldName()
  let secondChangeFilesName = filesName.map((item,index) => {
    if (filesNamePrefix[index]<10){
      let a = '0'
      let temp = a.concat(item)
      return temp
    }else{
      return item
    }
  })
  console.log("secondChangeFilesName:"+secondChangeFilesName)
  rename(filesName,secondChangeFilesName)
  // 文件名重新排序，貌似没必要/：哭笑
  /*
  secondChangeFilesName.sort((a,b)=>{
    return a.substring(0,a.lastIndexOf("."))-b.substring(0,b.lastIndexOf("."))
  })
  console.log(secondChangeFilesName)
  return secondChangeFilesName
  */
}


// 第三次改变，读取json数据，给文件重命名
const thirdChange = () => {
  let {filesName,filesNamePrefix,filesNameSuffix} = getOldName()
  // console.log(filesName)
  // 从json数据中读取视频序号(page)和名称(part)，B站信息是这样命名的
  let jsonContent = fs.readFileSync(jsonPath)
  let contentObj = JSON.parse(jsonContent).map((item,index) => {
    let page = item.page<10?`0${item.page}`:item.page
    let part = item.part
    return `${page}-${part+filesNameSuffix[index]}`
  })
  console.log("thirdChangeFilesName:"+contentObj)
  rename(filesName,contentObj)

}


// 测试  读取文件名、前缀、后缀  函数
// getOldName()

// 三步实现文件重命名
firstChange()
secondChange()
thirdChange()
