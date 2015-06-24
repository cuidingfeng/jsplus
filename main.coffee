###!
# JsPlus v0.0.1 (https://github.com/cuidingfeng/jsplus/)
# Copyright 2015 cuidingfeng, Inc.
# Licensed under MIT (https://github.com/cuidingfeng/jsplus/blob/master/LICENSE)
# Email: admin@baiketupu.com
# Generated by CoffeeScript 1.7.1
###

'use strict'

###
# JsPlus的定位是一个JavaScript库，目标是提供一系列简化JavaScript操作的基础方法，让开发专注于业务逻辑。
###

#静态对象主体
P = ->

#是否开启log
P.debug = true

#校验字符类型
regs =
	#数值型
	number: ///
            ^
              [+-]?
              [1-9][0-9]*
              (\.[0-9]+)?
              ([eE][+-][1-9][0-9]*)?
            $
              |
            ^
              [+-]?
              0?
              \.[0-9]+
              ([eE][+-][1-9][0-9]*)?
            $
            ///

	#小写字母
	lowercase: /^[a-z]$/

	#大写字母
	uppercase: /^[A-Z]$/

	#中文数字
	numberCn: /^[零一二三四五六七八九十百千万亿]+$/

#各种字符类型与数字的转换方法
# getnum: 当前类型转为数字
# getstr: 数字转为当前类型
conversion =
	#数字
	number:
		getnum: (s) -> Number s
		getstr: (n) -> n

	#小写字母
	lowercase:
		#小写字母转数字
		getnum: (s) -> s.charCodeAt(0) - 97
		#数字转小写字母
		getstr: (n) -> String.fromCharCode(n + 97)

	#大写字母
	uppercase:
		getnum: (s) -> s.charCodeAt(0) - 65
		getstr: (n) -> String.fromCharCode(n + 65)

	#中文数字
	numberCn:
		getnum: (s) -> P.cn2num s
		getstr: (n) -> P.num2cn n

#开启debug时，在控制台打印错误信息
log = (str) ->
	 console.log "JS-Plus:" + str if P.debug

#生成包装函数，fn可以为function或格式化字符串
getFnFormat = (fn) ->

	#如果传入的fn是函数，则原样返回
	if typeof fn is 'function'
		return fn

	#如果fn不是函数，则返回一个包装函数
	else
		return (index, $1) ->

			#替换字符串中的$1和$index
			# $1为数组的当前项值，$index为当前项在数组中的索引
			return fn.replace('$1', $1).replace('$index', index)


#生成标准化的数组生成规则参数
#返回值格式：[起始值, 递增值, 结束值, 字符类型]
getParam = (str = '') ->
	#分割取参数
	ss = str.split ":"

	#如果参数少于两个，则格式错误，返回未知类型
	if ss.length<2
		log '数列格式错误，请至少包括一个":"，否则原样返回'
		return [str, 0, null, -1]
	else

		#如果有两个参数，则第一个为起始值，第二个为结束值
		if ss.length is 2
			ss[2] = ss[1]
			ss[1] = null

		#如果参数多于两个，则第二个参数为递增值，并且转为数字，第三个参数为结束值
		else
			ss[1] = parseFloat ss[1]

			#如果递增值不是数字，则将递增值设为0
			if not ss[1]
				log '数列递增字符格式不正确，必须为数字'
				ss[1] = 0

		#获取起始值的字符类型
		tp1 = getType ss[0]

		#如果起始值和结束值的字符类型不一致，则把递增值设为0
		if tp1 isnt getType ss[2]
			log '数列起始值和结束值类型不一致'
			ss[1] = 0

		#如果字符类型为-1，则为不支持的类型，把递增值设为0
		if tp1 is -1
			log '数列格式暂时不支持'
			ss[1] = 0
		else

			#获取将当前字符类型转换为数字的处理函数
			fn = conversion[['number', 'lowercase', 'uppercase', 'numberCn'][tp1]].getnum

			ss[0] = fn ss[0]
			ss[2] = fn ss[2]

			#如果没有递增值，当起始值小于结束值时，将递增值设置为 1，否则设置为 -1
			if ss[1] is null
				ss[1] = if ss[0]<ss[2] then 1 else -1

			#如果有递增值，但是从起始值通过递增值无法到达结束值时，将递增值设置为 0
			else if ss[1] isnt 0 and (if ss[0]<ss[2] then 1 else -1) * ss[1] < 0
				log '数列递增数字正负符号不正确，无法从起始值递增到结束值'
				ss[1] = 0

		return [ss[0], ss[1], ss[2], tp1]

#获取字符类型
getType = (s) ->
	return 0 if regs.number.test s	#数字
	return 1 if regs.lowercase.test s	#小写字母
	return 2 if regs.uppercase.test s	#大写字母
	return 3 if regs.numberCn.test s	#汉字数字
	return -1 #无匹配类型

#获取数字化数组
# @param {param} [起始值, 递增值, 结束值, 字符类型]
getNums = (param) ->
	reArr = []

	#如果递增值为 0，或者字符类型不支持，则原样返回存在的起始值和结束值
	if param[1] is 0 or param[3] is -1
		reArr.push param[0] if param[0]
		reArr.push param[2] if param[2]
	else
		i = param[0]

		#从起始值到结束值，按递增值依次将数字添加到数组
		#第一个值为起始值，最后一个值为在递增方向不超过结束值的最近一个值
		#循环条件：当前值小于等于结束值，并且递增值为正数；或者当前值大于等于结束值，并且递增值为负数
		while i<=param[2] && param[1]>0 || i>=param[2] && param[1]<0
			reArr.push i
			i+=param[1]

	return reArr

#获取原字符化数组
getArr = (nums, tp) ->

	#如果字符类型可支持
	if tp isnt -1

		#获取将数字转换为当前字符类型的处理函数
		fn = conversion[['number', 'lowercase', 'uppercase', 'numberCn'][tp]].getstr

		#循环转换
		nums[i] = fn num for num, i in nums

	return nums

#用包装函数格式化数组
formatArr = (arr, cb) ->
	arr[i] = cb(i, li) for li, i in arr
	return arr



###
#========================================
# 静态对象对外提供的方法
# arr: 		按指定规则生成一个一维数组
# cn2num: 把中文数字转换为数值
# num2cn: 把自然数转换为中文数字
# assign: 按条件返回值
# inArr: 	按条件查找数组
# forArr: 按条件处理数组的每一项
#========================================
###

#按指定规则生成一个一维数组
#第一个参数为生成规则，是必选项
#第二个参数为包装函数，对数组的每个值分别进行处理，是可选项
P.arr = ->
	#取实参，并转换为数组
	arg = Array::slice.call arguments, 0

	#数组生成规则
	str = arg[0]

	#如果生成规则无效，则返回空数组
	return [] if not str? or typeof str isnt 'string'

	narr = []

	#包装函数
	fn = getFnFormat arg[1] or (index, $1) -> return $1

	#取到生成规则数组
	strs = str.split /\s*,\s*/

	for str in strs
		#标准化生成规则参数
		param = getParam str

		#取到数字化的数组结果
		nums = getNums param

		#取到字符化的数组结果，合并到主队列
		narr = narr.concat getArr(nums, param[3])

	#返回包装函数格式化后的完整数组
	formatArr narr, fn


#中文数字转换为数字
# @param {cn}, 中文数字，例如：三十万八千六
# 转换结果：388600
# 适用范围：大于等于 0，小于一亿亿的整数
P.cn2num = (cn) ->

	#末位不带单位时，补齐单位
	#例如三万二，给二补齐单位千
	endNum = (s, e) ->
      if /^[一二三四五六七八九]$/.test s
        return P.cn2num(s) * e
      else
        return P.cn2num s.replace /^零+/g, ''

	#如果参数不是string类型，则返回 0
	if typeof cn isnt 'string'
		log '中文数字转换参数类型不是String'
		return 0

	#如果参数是空字符串，则返回 0
	return 0 if cn is ''

  #如果参数不匹配中文数字格式规则，则返回 0
	if !regs.numberCn.test cn
		log '中文数字转换格式不正确'
		return 0

  #按亿分割数字
	nY = cn.split '亿'

	#如果包含至少两个‘亿’字，则不支持，返回 0
	if nY.length > 2
		log '中文数字转换最大支持单位为千万亿'
		return 0

	#如果包含一个亿字，则分别计算亿字前半部分和后半部分
	else if nY.length is 2
		return P.cn2num( nY[0] ) * 1e8 + endNum( nY[1], 1e7 )

	#如果不包含亿，则按万字分割数字
	else
		nW = cn.split '万'

		#如果包含至少两个‘万’字，则不支持，返回 0
		if nW.length > 2
			log '中文数字转换格式不正确，不能同时包含两个万字'
			return 0

		#如果包含一个万字，则分别计算万字前半部分和后半部分
		else if nW.length is 2
			return P.cn2num( nW[0]) * 1e4 + endNum( nW[1], 1e3 )

		#如果不包含万，则按千字分割数字
		else
			nQ = cn.split '千'

			#如果包含至少两个‘千’字，则不支持，返回 0
			if nQ.length > 2
				log '中文数字转换格式不正确，不能同时包含两个千字'
				return 0

			#如果包含一个千字，则分别计算千字前半部分和后半部分
			else if nQ.length is 2
				return P.cn2num( nQ[0] ) * 1e3 + endNum( nQ[1], 1e2 )

			#如果不包含千，则按百字分割数字
			else
				nB = cn.split '百'

				#如果包含至少两个‘百’字，则不支持，返回 0
				if nB.length > 2
					log '中文数字转换格式不正确，不能同时包含两个百字'
					return 0

				#如果包含一个百字，则分别计算百字前半部分和后半部分
				else if nB.length is 2
					return P.cn2num( nB[0] ) * 1e2 + endNum( nB[1], 1e1 )

				#如果不包含百，则按十字分割数字
				else
					nS = cn.split '十'

					#如果包含至少两个‘十’字，则不支持，返回 0
					if nS.length > 2
						log '中文数字转换格式不正确，不能同时包含两个十字'
						return 0

					#如果包含一个百字，则分别计算百字前半部分和后半部分
					else if nS.length is 2
						return P.cn2num(
                #如果十前面没有量词，默认设置为一，比如：十三，修正为一十三
                nS[0] or '一'
							) * 1e1 + endNum( nS[1], 1 )

					#如果不包含十，则返回个位数对应的数字
					else
						return '一二三四五六七八九'.indexOf( cn ) + 1

#end P.cn2num


#自然数转中文数字
# @param {n}, 自然数，例如：388006
# 转换结果：三十万八千零六
# @param {no0}, 逻辑值，转换独立数字 0时，是否返回空字符串，默认为假，返回“零”
# 适用范围：大于等于 0，小于一亿亿的整数
P.num2cn = (n, no0) ->

	#如果 n 不是number类型，则转为String类型原样返回
	if typeof n isnt 'number'
		log '数字换中文参数错误，必须为数字'
		return n + ''

	#如果 n 是负数或小数，则转为String类型原样返回
	if n < 0 or n % 1 > 0
		log '数字换中文只支持自然数'
		return n + ''

	if n is 0
		return if no0 then '' else '零'

	#按基数分割数字
	# @param {n}, 原数
	# @param {s}, 基数
	# @return [前半部分, 后半部分, 基数]
	splitNum = (n, s) -> [n // s, n %% s, s]

	#分割点
	karr = [['亿',1e8],['万',1e4],['千',1e3],['百',1e2],['十',1e1]]

	#依次尝试分割点
	for marr, i in karr

		#取到当前分割点对应的分割数组
		sY = splitNum n, marr[1]

		#如果分割点存在，及前半部分有值，则分别转换前后部分并连接
		if sY[0] > 0
			return P.num2cn( sY[0], true ) + #前半部分
             marr[0] +								 #分割点单位

             #如果后半部分的值小于基数的下一位数量级，并且后半部分大于 0
             ( if sY[1] < sY[2] / 10 	and		 sY[1] > 0 then '零' else '' ) +	#后半部分前缀补零
             P.num2cn(sY[1], true)		 #后半部分

		#否则，当前是尝试最后一个分割点，且不存在
		else if i is _len-1
			xGs = '一二三四五六七八九'.split ''
			xGs.unshift ''

			#返回个位数对应的数字
			return xGs[ sY[1] ]

#end P.num2cn


#按条件返回值
# @param {vals}, Array，例如：[[1, false], [2, true], 3, [4]]
# 返回值：第一个条件为真的值，没有条件相当于条件为真
# 适用场景：按不同条件返回不同值
P.assign = (vals) ->

	#如果参数不是Array类型，则不支持，返回null
	if not (vals instanceof Array)
		log '参数类型错误，期望是Array'
		return null

	#循环测试条件
	for val in vals

		#如果当前项不是数组，则相当于条件成立，原样返回当前项
		return val if not (val instanceof Array)

		#如果没有条件，或者条件为真，则返回当前值
		return val[0] if val.length is 1 or val.length > 1 and val[1]

	#无匹配条件，返回null
	log '无匹配的值'
	return null

#end P.assign


# 按条件查找数组
# @param {arr}: Array, 循环处理的数组
# @param {fn}: String or Function, 对每个数组值检测的函数或表达示，返回逻辑值
# @param {reVal}: 是否返回匹配的数组值，默认为false，返回是否匹配。
P.inArr = (arr, fn, reVal) ->

	#如果arr不是Array类型，则不支持，返回null
	if not (arr instanceof Array)
		log '参数类型错误，期望是Array'
		return null

	#如果fn不是Function类型，则把fn当作表达示生成一个检测函数
	if not (fn instanceof Function)
		fnstr = fn
		fn = (index, $1, size) ->

			#替换表达示中的标记符，$index为当前项的索引值，$1为当前项的值，$size为数组长度
			_fnstr = fnstr.replace( "$index", index ).replace( "$1", $1 ).replace( "$size", size )
			return ( new Function "return " + _fnstr )()

	#循环检测数组
	for ali, i in arr
		#如果当前项检测返回真
		if fn i, ali, _len

			#如果reVal为真返回数组当前值，否则返回true
			return if reVal then ali else true

	#数组中没有匹配项
	return if reVal then undefined else false

#end P.inArr


# 按条件处理数组的每一项
# @param {arr}: Array, 循环处理的数组
# @param {fn}: String or Function，对每个数组值进行处理的函数或表达示，返回值作为新数组对应位置的值
# @param {old}: 是否修改原数组，默认为false,不修改原数组。
# @return Array: 返回处理后的新数组
P.forArr = (arr, fn, old) ->

	#如果arr不是Array类型，则不支持，返回null
	if not (arr instanceof Array)
		log '参数类型错误，期望是Array'
		return null

	newArr = []

	#如果fn不是Function类型，则把fn当作表达示生成一个处理函数
	if not (fn instanceof Function)
		fnstr = fn
		fn = (index, $1, size) ->

			#替换表达示中的标记符，$index为当前项的索引值，$1为当前项的值，$size为数组长度
			_fnstr = fnstr.replace( "$index", index ).replace( "$1", $1 ).replace( "$size", size )
			return ( new Function "return " + _fnstr )()

	#循环处理数组
	for ali, i in arr

		#当前值处理后得到的新值
		nVal = fn i, ali, _len

		#添加到新数组
		newArr.push nVal

		#如果old为真，则修改原数组对应值为新值
		arr[i] = nVal if old

	return newArr

#end P.forArr

#将静态对象添加到顶级作用域上
this.P = P