(function() {
  QUnit.test("测试 arr基础功能", function(assert) {
    var arr, arr1, i, _i, _len, _results;
    arr1 = P.arr("1:5");
    expect(6);
    assert.ok(arr1.length === 5, "数组长度通过!");
    _results = [];
    for (i = _i = 0, _len = arr1.length; _i < _len; i = ++_i) {
      arr = arr1[i];
      _results.push(assert.ok(arr === i + 1, "数组元素通过!"));
    }
    return _results;
  });

  QUnit.test("测试 arr递增值", function(assert) {
    var arr, arr1, i, _i, _len, _results;
    arr1 = P.arr('8:0.5:12');
    assert.ok(arr1.length === 9, "数组长度通过!");
    _results = [];
    for (i = _i = 0, _len = arr1.length; _i < _len; i = ++_i) {
      arr = arr1[i];
      _results.push(assert.ok(arr === i * 0.5 + 8, "数组元素通过!"));
    }
    return _results;
  });

  QUnit.test("测试 arr自动判断递增方向", function(assert) {
    var arr, arr1, i, _i, _len, _results;
    arr1 = P.arr('12:8');
    assert.ok(arr1.length === 5, "数组长度通过!");
    _results = [];
    for (i = _i = 0, _len = arr1.length; _i < _len; i = ++_i) {
      arr = arr1[i];
      _results.push(assert.ok(arr === 12 - i, "数组元素通过!"));
    }
    return _results;
  });

  QUnit.test("测试 arr小写字母", function(assert) {
    var arr1;
    arr1 = P.arr('c:f');
    return assert.deepEqual(arr1, ['c', 'd', 'e', 'f'], "数组完全相等通过!");
  });

  QUnit.test("测试 arr大写字母", function(assert) {
    var arr1;
    arr1 = P.arr('G:-2:A');
    return assert.deepEqual(arr1, ['G', 'E', 'C', 'A'], "数组完全相等通过!");
  });

  QUnit.test("测试 arr中文数字", function(assert) {
    var arr1;
    arr1 = P.arr('二:5:二十');
    return assert.deepEqual(arr1, ['二', '七', '一十二', '一十七'], "数组完全相等通过!");
  });

  QUnit.test("测试 arr多段组合", function(assert) {
    var arr1;
    arr1 = P.arr('1:3, a:c ,D:F,一:三');
    return assert.deepEqual(arr1, [1, 2, 3, 'a', 'b', 'c', 'D', 'E', 'F', '一', '二', '三'], "数组完全相等通过!");
  });

  QUnit.test("测试 arr表达示格式化", function(assert) {
    var arr1;
    arr1 = P.arr('a:c', 'text$1-$index');
    return assert.deepEqual(arr1, ['texta-0', 'textb-1', 'textc-2'], "数组完全相等通过!");
  });

  QUnit.test("测试 arr函数格式化", function(assert) {
    var arr1;
    arr1 = P.arr('a:c', function(index, $1) {
      return index * 2 + $1;
    });
    return assert.deepEqual(arr1, ['0a', '2b', '4c'], "数组完全相等通过!");
  });

  QUnit.test("测试 arr参数异常", function(assert) {
    var arr1;
    arr1 = P.arr('a:C');
    assert.deepEqual(arr1, ['a', 'C'], "a:C通过!");
    arr1 = P.arr('ac');
    assert.deepEqual(arr1, ['ac'], "ac通过!");
    arr1 = P.arr('(:)');
    assert.deepEqual(arr1, ['(', ')'], "(:)通过!");
    arr1 = P.arr('4:0:6');
    assert.deepEqual(arr1, [4, 6], "4:0:6通过!");
    arr1 = P.arr('a:-1:c');
    assert.deepEqual(arr1, ['a', 'c'], "a:-1:c通过!");
    arr1 = P.arr(123);
    assert.deepEqual(arr1, [], "无效参数通过!");
    arr1 = P.arr();
    assert.deepEqual(arr1, [], "无效参数通过!");
    arr1 = P.arr('a:b:c');
    return assert.deepEqual(arr1, ['a', 'c'], "递增值类型错误通过!");
  });

  QUnit.test("测试 cn2num中文转换数字", function(assert) {
    var num1;
    num1 = P.cn2num('八');
    assert.strictEqual(num1, 8, "数字8通过!");
    num1 = P.cn2num('十五');
    assert.strictEqual(num1, 15, "数字15通过!");
    num1 = P.cn2num('一百六十二');
    assert.strictEqual(num1, 162, "数字162通过!");
    num1 = P.cn2num('一千零一');
    assert.strictEqual(num1, 1001, "数字1001通过!");
    num1 = P.cn2num('一千一');
    assert.strictEqual(num1, 1100, "数字1100通过!");
    num1 = P.cn2num('五万');
    assert.strictEqual(num1, 50000, "数字50 000通过!");
    num1 = P.cn2num('三千零二十万五千零八');
    assert.strictEqual(num1, 30205008, "数字30 205 008通过!");
    num1 = P.cn2num('九十亿三千零二十万五千零八');
    assert.strictEqual(num1, 9030205008, "数字9 030 205 008通过!");
    num1 = P.cn2num('九千九百九十九万九千九百九十九亿九千九百九十九万九千九百九十八');
    assert.strictEqual(num1, 9999999999999998, "数字9 999 999 999 999 998通过!");
    num1 = P.cn2num('零');
    return assert.strictEqual(num1, 0, "数字0通过!");
  });

  QUnit.test("测试 num2cn数字转中文", function(assert) {
    var num1;
    num1 = P.num2cn(8);
    assert.strictEqual(num1, '八', "数字八通过!");
    num1 = P.num2cn(15);
    assert.strictEqual(num1, '一十五', "数字十五通过!");
    num1 = P.num2cn(162);
    assert.strictEqual(num1, '一百六十二', "数字一百六十二通过!");
    num1 = P.num2cn(1001);
    assert.strictEqual(num1, '一千零一', "数字一千零一通过!");
    num1 = P.num2cn(1100);
    assert.strictEqual(num1, '一千一百', "数字一千一通过!");
    num1 = P.num2cn(50000);
    assert.strictEqual(num1, '五万', "数字五万通过!");
    num1 = P.num2cn(30205008);
    assert.strictEqual(num1, '三千零二十万五千零八', "数字三千零二十万五千零八通过!");
    num1 = P.num2cn(9030205008);
    assert.strictEqual(num1, '九十亿三千零二十万五千零八', "数字九十亿三千零二十万五千零八通过!");
    num1 = P.num2cn(9999999999999998);
    assert.strictEqual(num1, '九千九百九十九万九千九百九十九亿九千九百九十九万九千九百九十八', "数字九千九百九十九万九千九百九十九亿九千九百九十九万九千九百九十八通过!");
    num1 = P.num2cn(0);
    return assert.strictEqual(num1, '零', "数字零通过!");
  });

  QUnit.test("测试 assign按条件返回值", function(assert) {
    var val;
    val = P.assign([["a", true], ["b", false]]);
    assert.strictEqual(val, 'a', '正常数组通过!');
    val = P.assign([["a", false], ["b"]]);
    assert.strictEqual(val, 'b', '无判断条件数组通过!');
    val = P.assign([["a", false], "c"]);
    assert.strictEqual(val, 'c', '循环项非数组通过!');
    val = P.assign([["a", true], ["b", true]]);
    assert.strictEqual(val, 'a', '多条件成立，返回第一个，通过!');
    val = P.assign([["a", false], ["b", false]]);
    assert.strictEqual(val, null, '无匹配项通过!');
    val = P.assign('a');
    return assert.strictEqual(val, null, '参数非数组通过!');
  });

  QUnit.test("测试 inArr按条件查找数组", function(assert) {
    var arr1, b;
    arr1 = P.arr("3:8");
    b = P.inArr(arr1, '$1>5');
    assert.strictEqual(b, true, '多元素匹配通过!');
    b = P.inArr(arr1, '$1<3');
    assert.strictEqual(b, false, '无元素匹配通过!');
    b = P.inArr(arr1, function(index, $1, size) {
      return size - index > $1;
    });
    assert.strictEqual(b, true, '函数条件匹配通过!');
    b = P.inArr(arr1, '$1>5', true);
    assert.strictEqual(b, 6, '返回匹配值通过!');
    b = P.inArr(arr1, '$1>9', true);
    return assert.strictEqual(b, void 0, '返回匹配值，无匹配项通过!');
  });

  QUnit.test("测试 forArr按条件处理数组的每一项", function(assert) {
    var arr1, arr2, arr3, err;
    arr1 = P.arr("3:5");
    arr2 = P.forArr(arr1, '$1+1');
    assert.deepEqual(arr2, [4, 5, 6], '新数组正确');
    assert.deepEqual(arr1, [3, 4, 5], '原数组正确');
    P.forArr(arr1, '$1-1', true);
    assert.deepEqual(arr1, [2, 3, 4], '修改原数组正确');
    arr3 = P.forArr(arr1, function(index, $1, size) {
      return index + $1 + size;
    });
    assert.deepEqual(arr3, [5, 7, 9], '用函数处理正确');
    err = P.forArr("test");
    return assert.deepEqual(err, null, '参数错误');
  });

}).call(this);
