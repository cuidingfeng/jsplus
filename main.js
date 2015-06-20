!function(win){
	var P = function(){}, fnDformat, getParam, getNums, getArr, log, getType, regs, conversion, getFnFormat, formatArr;
	P.arr = function(){
		var arg = Array.prototype.slice.call(arguments,0),
			str = arg[0],param,nums,narr = [],strs,
			fn = getFnFormat(arg[1] || fnDformat);
		strs = str.split(/\s*,\s*/);
		for (var i=0;i<strs.length;i++) {
			param = getParam(strs[i]),
			nums = getNums(param),
			narr = narr.concat( getArr(nums, param[3]) );
		}
		return formatArr(narr, fn);
	};
	P.debug = true;//是否开启console.log
	/*中文数字转换为数字*/
	P.cn2num = function(cn){
		/*末位不带单位时，补齐单位*/
		var endNum = function(s, e){
				if(/^[一二三四五六七八九]$/.test(s)){
					return P.cn2num(s)*e;
				}else{
					return P.cn2num(s.replace(/^零+/g,''));
				}
			};
		if(typeof(cn)!='string'){
			log('中文数字转换参数无效');
			return 0;
		}if(cn===''){
			return 0;
		}if(!regs.numberCn.test(cn)){
			log('中文数字转换格式不正确');
			return 0;
		}
		var nY = cn.split('亿'), nW, nQ, nB, nS;
		if(nY.length>2){
			log('中文数字转换最大支持单位为千万亿')
			return 0;
		}else if(nY.length==2){
			return P.cn2num(nY[0])*1e8 + endNum(nY[1],1e7);
		}else{
			nW = cn.split('万');
			if(nW.length>2){
				log('中文数字转换格式不正确');
				return 0;
			}else if(nW.length==2){
				return P.cn2num(nW[0])*1e4 + endNum(nW[1],1e3);
			}else{
				nQ = cn.split('千');
				if(nQ.length>2){
					log('中文数字转换格式不正确');
					return 0;
				}else if(nQ.length==2){
					return P.cn2num(nQ[0])*1e3 + endNum(nQ[1],1e2);
				}else{
					nB = cn.split('百');
					if(nB.length>2){
						log('中文数字转换格式不正确');
						return 0;
					}else if(nB.length==2){
						return P.cn2num(nB[0])*1e2 + endNum(nB[1],1e1);
					}else{
						nS = cn.split('十');
						if(nS.length>2){
							log('中文数字转换格式不正确');
							return 0;
						}else if(nS.length==2){
							return P.cn2num(nS[0] || '一')*1e1 + endNum(nS[1],1);
						}else{
							return '一二三四五六七八九'.indexOf(cn)+1;
						}

					}

				}

			}
		}
	};	P.num2cn = function(n, no0){
		if(typeof(n)!='number'){
			log('数字换中文参数错误，必须为数字');
			return n + '';
		}if(n<0 || n%1>0){
			log('数字换中文只支持自然数');
			return n + '';
		}if(n==0){
			return no0?'':'零';
		}
		var splitNum = function(n, s){
			return [Math.floor(n/s), n%s, s];
		}, sY;
		var karr = [['亿',1e8],['万',1e4],['千',1e3],['百',1e2],['十',1e1]];
		for(var i=0;i<karr.length;i++){
			sY = splitNum(n, karr[i][1]);
			if(sY[0]>0){
				return P.num2cn(sY[0],true)+karr[i][0]+(sY[1]<sY[2]/10 && sY[1]>0?'零':'')+P.num2cn(sY[1],true);
			}else if(i==karr.length-1){
				var xGs = '一二三四五六七八九'.split('');
				xGs.unshift('');
				return xGs[sY[1]];
			}
		}
	};
	regs = {
		number: /^[+-]?[1-9][0-9]*(\.[0-9]+)?([eE][+-][1-9][0-9]*)?$|^[+-]?0?\.[0-9]+([eE][+-][1-9][0-9]*)?$/,
		lowercase: /^[a-z]$/,
		uppercase: /^[A-Z]$/,
		numberCn: /^[零一二三四五六七八九十百千万亿]+$/
	};
	conversion = {
		number: {
			getnum: function(s){return Number(s)},
			getstr: function(n){return n}
		},
		lowercase: {
			getnum: function(s){
				return s.charCodeAt(0)-97;
			},
			getstr: function(n){
				return String.fromCharCode(n + 97);
			}
		},
		uppercase: {
			getnum: function(s){
				return s.charCodeAt(0)-65;
			},
			getstr: function(n){
				return String.fromCharCode(n + 65);
			}
		},
		numberCn: {
			getnum: function(s){
				return P.cn2num(s);
			},
			getstr: function(n){
				return P.num2cn(n);
			}
		}
	};
	log = function(str){
		P.debug && console.log("JS-Plus:" + str);
	};
	fnDformat = function(index, $1){
		return $1
	};
	getFnFormat = function(fn){
		if(typeof(fn)=='function'){
			return fn;
		}else{
			return function(index, $1){
				return fn.replace('$1', $1).replace('$index', index);
			};
		}
	};
	getParam = function(str){
		str = str || '';
		var ss = str.split(":");
		if(ss.length<2){
			log('数列格式错误，请至少包括一个":"，否则原样返回');
			return [str, 0, null, -1];
		}else{
			if( ss.length === 2 ){
				ss[2] = ss[1];
				ss[1] = null;
			}else{
				ss[1] = parseFloat(ss[1]);
				if( !ss[1] ){
					log('数列递增字符格式不正确，必须为数字');
					ss[1] = 0;
				}
			}
			var tp1 = getType(ss[0]);
			if( tp1 !== getType(ss[2]) ){
				log('数列起始值和结束值类型不一致');
				ss[1] = 0;
			}
			if( tp1==-1 ){
				log('数列格式暂时不支持');
				ss[1] = 0;
			}else{
				var fn = conversion[['number', 'lowercase', 'uppercase', 'numberCn'][tp1]].getnum;
				ss[0] = fn(ss[0]);
				ss[2] = fn(ss[2]);
				if( ss[1] == null ){
					ss[1] = ss[0]<ss[2]?1:-1;
				}else if( ss[1]!=0 && (ss[0]<ss[2]?1:-1)*ss[1]<0 ){
					log('数列递增数字正负符号不正确，无法从起始值递增到结束值');
					ss[1] = 0;
				}
			}
			return [ss[0], ss[1], ss[2], tp1];
		}
	};
	getType = function(s){
		if(regs.number.test(s)){
			return 0;//数字
		}if(regs.lowercase.test(s)){
			return 1;//小写字母
		}if(regs.uppercase.test(s)){
			return 2;//大写字母
		}if(regs.numberCn.test(s)){
			return 3;//汉字数字
		}
		return -1;
	};
	getNums = function(param){
		var reArr = [];
		if(param[1]==0 || param[3]==-1){
			param[0] && reArr.push(param[0]);
			param[2] && reArr.push(param[2]);
		}else{
			for(var i=param[0];i<=param[2] && param[1]>0 || i>=param[2] && param[1]<0;i+=param[1]){
				reArr.push(i);
			}
		}
		return reArr;
	};
	getArr = function(nums, tp){
		if(tp!=-1){
			var fn = conversion[['number', 'lowercase', 'uppercase', 'numberCn'][tp]].getstr;
			for(var i=0;i<nums.length;i++){
				nums[i] = fn(nums[i]);
			}
		}
		return nums;
	};
	formatArr = function(arr, cb){
		for(var i=0;i<arr.length;i++){
			arr[i] = cb(i,arr[i]);
		}
		return arr;
	};
	P.assign = function(vals){
		if(!(vals instanceof Array)){
			log('参数类型错误，期望是Array');
			return null;
		}
		for(var i=0;i<vals.length;i++){
			if(!(vals[i] instanceof Array)){
				return vals[i];
			}
			if(vals[i].length==1 || vals[i].length>1 && vals[i][1]){
				return vals[i][0];
			}
		}
		log('无匹配的值');
		return null;
	};
	/*
	* function inArr;
	* arr: 循环处理的数组
	* fn: 对每个数组值检测的函数或表达示，返回逻辑值
	* reVal: 是否返回匹配的数组值，默认为false,返回是否有匹配。
	*/
	P.inArr = function(arr, fn, reVal){
		if(!(arr instanceof Array)){
			log('参数类型错误，期望是Array');
			return null;
		}
		if(!(fn instanceof Function)){
			var fnstr = fn;
			fn = function(index, val, size){
					var _fnstr = fnstr.replace("$index",index).replace("$1",val).replace("$size",size);
					return (new Function("return "+_fnstr))()
			}
		}
		for(var i=0,len=arr.length;i<len;i++){
			if(fn(i,arr[i],len)){
				return reVal?arr[i]:true;
			}
		}
		return reVal?undefined:false;
	};

	/*
	* function forArr;
	* arr: 循环处理的数组
	* fn: 对每个数组值检测的函数或表达示，返回值作为新数组对应位置的值
	* old: 是否修改原数组，默认为false,不修改原数组。
	*/
	P.forArr = function(arr, fn, old){
		if(!(arr instanceof Array)){
			log('参数类型错误，期望是Array');
			return null;
		}
		var newArr = [], nVal;
		if(!(fn instanceof Function)){
			var fnstr = fn;
			fn = function(index, val, size){
					var _fnstr = fnstr.replace("$index",index).replace("$1",val).replace("$size",size);
					return (new Function("return "+_fnstr))()
			}
		}
		for(var i=0,len=arr.length;i<len;i++){
			nVal = fn(i,arr[i],len);
			newArr.push(nVal);
			if(old){
				arr[i] = nVal;
			}
		}
		return newArr;
	};
	win.P = P;
}(window)
