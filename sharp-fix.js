// sharp-fix.js
const Module = require('module');
const originalRequire = Module.prototype.require;

Module.prototype.require = function(id) {
  if (id === 'sharp' || id.includes('sharp')) {
    console.log('⚠️  Sharp deshabilitado - retornando mock');
    return {
      resize: () => ({ toBuffer: () => Promise.resolve(Buffer.from('')) }),
      __esModule: true
    };
  }
  return originalRequire.apply(this, arguments);
};