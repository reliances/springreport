/*
 * @Description: C-Lodop 打印工具
 */

let lodopScriptPromise = null;
let lodopScriptUrlCache = '';

function loadLodopScript(scriptUrl) {
  if (typeof window.getCLodop === 'function') {
    return Promise.resolve();
  }
  if (lodopScriptPromise && lodopScriptUrlCache === scriptUrl) {
    return lodopScriptPromise;
  }
  lodopScriptUrlCache = scriptUrl;
  lodopScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = scriptUrl;
    script.onload = () => {
      if (typeof window.getCLodop === 'function') {
        resolve();
      } else {
        reject(new Error('CLodop 未安装或未启动'));
      }
    };
    script.onerror = () => reject(new Error('加载 C-Lodop 脚本失败'));
    document.head.appendChild(script);
  });
  return lodopScriptPromise;
}

function getLodop() {
  const lodop = window.getCLodop();
  if (!lodop) {
    throw new Error('CLodop 未安装或未启动');
  }
  return lodop;
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result || '';
      const base64 = String(result).split(',')[1] || '';
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export async function ensureLodop(scriptUrl) {
  await loadLodopScript(scriptUrl);
  getLodop();
}

export async function printPdfBlob(blob, mode) {
  const lodop = getLodop();
  const base64 = await blobToBase64(blob);
  lodop.PRINT_INIT('SpringReport打印');
  lodop.ADD_PRINT_PDF(0, 0, '100%', '100%', base64);
  if (mode === 'preview') {
    lodop.PREVIEW();
  } else {
    lodop.PRINT();
  }
}

export default {
  ensureLodop,
  printPdfBlob,
};
