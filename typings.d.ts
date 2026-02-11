import 'umi/typings';

// 声明 less 文件模块
declare module '*.less' {
  const content: Record<string, string>;
  export default content;
}

// 声明 css 文件模块
declare module '*.css' {
  const content: Record<string, string>;
  export default content;
}

// 声明 scss 文件模块
declare module '*.scss' {
  const content: Record<string, string>;
  export default content;
}
