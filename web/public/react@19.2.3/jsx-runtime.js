(function(global) {
  if (!global.React) throw new Error("React must be loaded before jsxRuntime shim");

  var React = global.React;
  
  function shim(type, props, key) {
    // 性能优化：如果 props 已经是通过 new Object() 创建的且没有原型链问题，
    // 可以视情况省略浅拷贝，但为了安全起见，Object.assign 是标准的
    var config = Object.assign({}, props);
    if (key !== undefined && key !== null) {
      config.key = key;
    }
    return React.createElement(type, config);
  }

  var shimObj = {
    Fragment: React.Fragment,
    jsx: shim,
    jsxs: shim,
    jsxDEV: shim
  };

  // 暴露给 window.jsxRuntime (适配你的第三方包)
  global.jsxRuntime = shimObj;
  
  // 许多其他库可能查找的是 window.ReactJSXRuntime，建议同时暴露
  global.ReactJSXRuntime = shimObj; 

})(window);