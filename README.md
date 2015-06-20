# jsplus
JS基础扩展库
正在开发中……
#
/*生成一年的日期*/
var days = P.arr("1:12", function(index, $1){
    return [$1, P.assign([
      [P.arr("1:31"), P.inArr([1,3,5,7,8,10,12], '$1=='+$1)],
      [P.arr("1:30"), P.inArr([4,6,9,11], '$1=='+$1)],
      [P.arr("1:28"), P.inArr([2], '$1=='+$1)]
    ])]
})
