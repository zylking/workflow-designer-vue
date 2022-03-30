module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    'eslint:recommended'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    // 禁用 console   生产环境警告，开发环境关闭
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    // 禁用 debugger  生产环境警告，开发环境关闭
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    // 要求使用 === 和 !==
    'eqeqeq': ['error', 'always'],
    // 禁止 if 语句中 return 语句之后有 else 块
    'no-else-return': 'error',
    // 禁止在没有类型检查操作符的情况下与 null 进行比较
    'no-eq-null': 'error',
    // 强制使用一致的缩进
    // 'indent': ['error', 2, {outerIIFEBody: 0, ObjectExpression: 1}],
    // 由于vue文件script标签内IDE格式化后会自动缩进2空格，这时eslint的indent会导致报错，然而我们需要保持vue文件风格一致，
    // 故使用vue/script-indent缩进配置
    'vue/script-indent': ['error', 2, {baseIndent: 1, switchCase: 1}],
    // 防止在同一元素上同时使用v-for指令和v-if指令
    'vue/no-use-v-if-with-v-for': 'error',
    // v-for 必须 绑定 key，template除外
    'vue/require-v-for-key': 'error',
    // 关闭标记的括号>之前强制使用一致的间距样式
    'vue/html-closing-bracket-spacing': ['error', {'startTag': 'never', 'endTag': 'never', 'selfClosingTag': 'never'}],
    // html标签属性使用双引号
    'vue/html-quotes': 'error',
    // 要求或禁止使用分号代替 ASI
    'semi': ['error', 'always'],
    // 要求操作符周围有空格
    'space-infix-ops': 'error',
    // 强制在一元操作符前后使用一致的空格
    'space-unary-ops': ['error', {words: true, nonwords: false}],
    // 强制在 switch 的冒号左右有空格
    'switch-colon-spacing': ['error', {after: true, before: false}],
    // 禁用不必要的标签
    'no-extra-label': 'error',
    // 禁止变量声明覆盖外层作用域的变量
    'no-shadow': 'error',
    // 禁止将变量初始化为 undefined
    'no-undef-init': 'error',
    // 禁止在变量定义之前使用它们
    'no-use-before-define': 'error',
    // 强制所有控制语句使用一致的括号风格
    // 以前自己开发项目时，喜欢if后面如果没有多行，喜欢省略大括号，现在为了统一代码风格，适合多人开发和代码的可读性
    // 强制所有控制语句使用大括号
    'curly': ['error', 'all'],
    // 禁用逗号操作符
    'no-sequences': 'error',
    // 需要把立即执行的函数包裹起来
    'wrap-iife': ['error', 'inside'],
    // 强制在代码块中开括号前和闭括号后有空格 花括号
    'block-spacing': ['error', 'always'],
    // 大括号风格要求
    'brace-style': ['error', '1tbs'],
    // 要求或禁止语句块之前的空格
    'space-before-blocks': ['error', 'always'],
    // 要求箭头函数的箭头之前或之后有空格
    'arrow-spacing': ['error'],
    // 要求使用 let 或 const
    'no-var': 'error',
    // 禁止在 case 或 default 子句中出现词法声明
    'no-case-declarations': 'off',
    // 强制关键字周围空格的一致性
    'keyword-spacing': ['error', {before: true, after: true}],
    // 强制在逗号周围使用空格 (comma-spacing)
    'comma-spacing': ['error', {before: false, after: true}],
    // 逗号风格 (comma-style)
    'comma-style': ['error', 'last', {
      exceptions: {
        'ArrayExpression': false,             // 忽略数组字面量的逗号风格
        'ArrayPattern': false,                // 忽略数组的解构赋值语句中的逗号风格
        'ArrowFunctionExpression': false,     // 忽略箭头函数表达式的参数中的逗号风格
        'CallExpression': false,              // 忽略函数调用的参数中的逗号风格
        'FunctionDeclaration': false,         // 忽略函数声明的参数中的逗号风格
        'FunctionExpression': true,           // 忽略函数表达式的参数中的逗号风格
        'ImportDeclaration': false,           // 忽略 import 语句中的逗号风格
        'ObjectExpression': true,             // 忽略对象字面量的逗号风格
        'ObjectPattern': false,               // 忽略对象的解构赋值中的逗号风格
        'VariableDeclaration': false,         // 忽略变量声明的逗号风格
        'NewExpression': false                // 忽略构造函数表达式参数中的逗号风格
      }
    }],
    // 要求在注释前有空白 (space 或 tab) (spaced-comment)
    'spaced-comment': ['error', 'always']
  }
};
