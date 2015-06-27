# JsPlus

JS基础扩展库

开发进行中……

##目前支持的方法，具体用法请感受下面的例子或查看源码main.coffee

* [P.arr](//github.com/cuidingfeng/jsplus/wiki/arr):       按指定规则生成一个一维数组
* [P.cn2num](//github.com/cuidingfeng/jsplus/wiki/cn2num): 把中文数字转换为数值
* [P.num2cn](//github.com/cuidingfeng/jsplus/wiki/num2cn): 把自然数转换为中文数字
* [P.assign](//github.com/cuidingfeng/jsplus/wiki/assign): 按条件返回值
* [P.inArr](//github.com/cuidingfeng/jsplus/wiki/inArr):   按条件查找数组
* [P.forArr](//github.com/cuidingfeng/jsplus/wiki/forArr): 按条件处理数组的每一项

***

## 几个小李子

### 生成1到10按0.5递增的数组

```javascript
P.arr("1:0.5:10")

/*
[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10]
*/
```

### 生成100到90递减，及10到80按5递增的数组

```javascript
P.arr("100:90,10:5:80")

/*
[100, 99, 98, 97, 96, 95, 94, 93, 92, 91, 90, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80]
*/
```

### 生成W到B，两两间隔一个字母的数组

```javascript
P.arr("W:-2:B")

/*
["W", "U", "S", "Q", "O", "M", "K", "I", "G", "E", "C"]
*/
```


### 生成3到11、a到n、二十到三十八组合的数组，并每项加前缀"text"，后缀"-"加当前值的数组索引

```javascript
P.arr("3:11, a:n ,二十:三十八","text$1-$index")

/*
["text3-0", "text4-1", "text5-2", "text6-3", "text7-4", "text8-5", "text9-6", "text10-7", "text11-8", "texta-9", "textb-10", "textc-11", "textd-12", "texte-13", "textf-14", "textg-15", "texth-16", "texti-17", "textj-18", "textk-19", "textl-20", "textm-21", "textn-22", "text二十-23", "text二十一-24", "text二十二-25", "text二十三-26", "text二十四-27", "text二十五-28", "text二十六-29", "text二十七-30", "text二十八-31", "text二十九-32", "text三十-33", "text三十一-34", "text三十二-35", "text三十三-36", "text三十四-37", "text三十五-38", "text三十六-39", "text三十七-40", "text三十八-41"]
*/
```

### 生成1-6乘a-d的二维数组

```javascript
P.arr("1:6", function(index, $1){
  //return {k:"I"+index, v:$1*2}
  return P.arr("a:d","$1"+$1)
})

/*
[
  ["a1","b1","c1","d1"],
  ["a2","b2","c2","d2"],
  ["a3","b3","c3","d3"],
  ["a4","b4","c4","d4"],
  ["a5","b5","c5","d5"],
  ["a6","b6","c6","d6"]
]
*/
```

### inArr和forArr，感受一下

```javascript
var arr1 = P.arr("1:8");
/*
arr1 = [1, 2, 3, 4, 5, 6, 7, 8]
*/

var b = P.inArr(arr1,'$1==2');
/*
b = true
*/

var arr2 = P.forArr(arr1,'$1*3',true);
/*
arr1 = arr2 = [3, 6, 9, 12, 15, 18, 21, 24]
*/

var c = P.forArr(arr1, function(index, $1){
  return index+$1;
});
/*
c = [3, 7, 11, 15, 19, 23, 27, 31]
*/
```

### 综合使用，生成一年的日期

```javascript
var days = P.arr("1:12", function(index, $1){
    return [$1, P.assign([
      [P.arr("1:31"), P.inArr([1,3,5,7,8,10,12], '$1=='+$1)],
      [P.arr("1:30"), P.inArr([4,6,9,11], '$1=='+$1)],
      [P.arr("1:28"), P.inArr([2], '$1=='+$1)]
    ])]
})

/*
[
  [1,[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]],
  [2,[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28]],
  [3,[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]],
  [4,[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30]],
  [5,[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]],
  [6,[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30]],
  [7,[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]],
  [8,[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]],
  [9,[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30]],
  [10,[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]],
  [11,[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30]],
  [12,[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]]
]
*/
```


### 升级一下，生成中文格式的一年日期

```javascript
var days = P.arr("一:十二", function(index, $1){
    return [$1+'月', P.assign([
      [P.arr("一:三十一","$1日"), P.inArr([1,3,5,7,8,10,12], '$1=='+(index+1))],
      [P.arr("一:三十","$1日"), P.inArr([4,6,9,11], '$1=='+(index+1))],
      [P.arr("一:二十八","$1日"), P.inArr([2], '$1=='+(index+1))]
    ])]
})

/*
[
  ["一月",
    ["一日","二日","三日","四日","五日","六日","七日","八日","九日","一十日",
    "一十一日","一十二日","一十三日","一十四日","一十五日","一十六日","一十七日","一十八日","一十九日","二十日",
    "二十一日","二十二日","二十三日","二十四日","二十五日","二十六日","二十七日","二十八日","二十九日","三十日","三十一日"]
  ],
  ["二月",
    ["一日","二日","三日","四日","五日","六日","七日","八日","九日","一十日",
    "一十一日","一十二日","一十三日","一十四日","一十五日","一十六日","一十七日","一十八日","一十九日","二十日",
    "二十一日","二十二日","二十三日","二十四日","二十五日","二十六日","二十七日","二十八日"]
  ],
  ["三月",
    ["一日","二日","三日","四日","五日","六日","七日","八日","九日","一十日",
    "一十一日","一十二日","一十三日","一十四日","一十五日","一十六日","一十七日","一十八日","一十九日","二十日",
    "二十一日","二十二日","二十三日","二十四日","二十五日","二十六日","二十七日","二十八日","二十九日","三十日","三十一日"]
  ],
  ["四月",
    ["一日","二日","三日","四日","五日","六日","七日","八日","九日","一十日",
    "一十一日","一十二日","一十三日","一十四日","一十五日","一十六日","一十七日","一十八日","一十九日","二十日",
    "二十一日","二十二日","二十三日","二十四日","二十五日","二十六日","二十七日","二十八日","二十九日","三十日"]
  ],
  ["五月",
    ["一日","二日","三日","四日","五日","六日","七日","八日","九日","一十日",
    "一十一日","一十二日","一十三日","一十四日","一十五日","一十六日","一十七日","一十八日","一十九日","二十日",
    "二十一日","二十二日","二十三日","二十四日","二十五日","二十六日","二十七日","二十八日","二十九日","三十日","三十一日"]
  ],
  ["六月",
    ["一日","二日","三日","四日","五日","六日","七日","八日","九日","一十日",
    "一十一日","一十二日","一十三日","一十四日","一十五日","一十六日","一十七日","一十八日","一十九日","二十日",
    "二十一日","二十二日","二十三日","二十四日","二十五日","二十六日","二十七日","二十八日","二十九日","三十日"]
  ],
  ["七月",
    ["一日","二日","三日","四日","五日","六日","七日","八日","九日","一十日",
    "一十一日","一十二日","一十三日","一十四日","一十五日","一十六日","一十七日","一十八日","一十九日","二十日",
    "二十一日","二十二日","二十三日","二十四日","二十五日","二十六日","二十七日","二十八日","二十九日","三十日","三十一日"]
  ],
  ["八月",
    ["一日","二日","三日","四日","五日","六日","七日","八日","九日","一十日",
    "一十一日","一十二日","一十三日","一十四日","一十五日","一十六日","一十七日","一十八日","一十九日","二十日",
    "二十一日","二十二日","二十三日","二十四日","二十五日","二十六日","二十七日","二十八日","二十九日","三十日","三十一日"]
  ],
  ["九月",
    ["一日","二日","三日","四日","五日","六日","七日","八日","九日","一十日",
    "一十一日","一十二日","一十三日","一十四日","一十五日","一十六日","一十七日","一十八日","一十九日","二十日",
    "二十一日","二十二日","二十三日","二十四日","二十五日","二十六日","二十七日","二十八日","二十九日","三十日"]
  ],
  ["一十月",
    ["一日","二日","三日","四日","五日","六日","七日","八日","九日","一十日",
    "一十一日","一十二日","一十三日","一十四日","一十五日","一十六日","一十七日","一十八日","一十九日","二十日",
    "二十一日","二十二日","二十三日","二十四日","二十五日","二十六日","二十七日","二十八日","二十九日","三十日","三十一日"]
  ],
  ["一十一月",
    ["一日","二日","三日","四日","五日","六日","七日","八日","九日","一十日",
    "一十一日","一十二日","一十三日","一十四日","一十五日","一十六日","一十七日","一十八日","一十九日","二十日",
    "二十一日","二十二日","二十三日","二十四日","二十五日","二十六日","二十七日","二十八日","二十九日","三十日"]
  ],
  ["一十二月",
    ["一日","二日","三日","四日","五日","六日","七日","八日","九日","一十日",
    "一十一日","一十二日","一十三日","一十四日","一十五日","一十六日","一十七日","一十八日","一十九日","二十日",
    "二十一日","二十二日","二十三日","二十四日","二十五日","二十六日","二十七日","二十八日","二十九日","三十日","三十一日"]
  ]
]
*/
```
