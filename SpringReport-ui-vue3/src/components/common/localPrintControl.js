/*
 * @Description: 本机静默打印控件（127.0.0.1 HTTP 协议）
 * 协议与检验系统本机打印控件一致：/health /config /print
 */

const DEFAULT_AGENT_URL = 'http://127.0.0.1:18666';

export function normalizeAgentUrl(url) {
  return String(url || DEFAULT_AGENT_URL).replace(/\/+$/, '');
}

export async function health(agentUrl) {
  const base = normalizeAgentUrl(agentUrl);
  const res = await fetch(`${base}/health`, { method: 'GET', cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`打印控件响应异常: ${res.status}`);
  }
  return res.json();
}

export async function readConfig(agentUrl) {
  const base = normalizeAgentUrl(agentUrl);
  const res = await fetch(`${base}/config`, { method: 'GET', cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`读取打印控件配置失败: ${res.status}`);
  }
  const data = await res.json();
  return data?.config || {};
}

export function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || '');
      resolve(text.includes(',') ? text.split(',')[1] : text);
    };
    reader.onerror = () => reject(reader.error || new Error('读取 PDF 内容失败'));
    reader.readAsDataURL(blob);
  });
}

/** 向本机控件投递 base64 PDF */
export async function printBase64(base64, agentUrl, templateId) {
  const body = { base64 };
  const tid = Number(templateId || 0);
  if (tid > 0) {
    body.templateId = tid;
  }
  const base = normalizeAgentUrl(agentUrl);
  const res = await fetch(`${base}/print`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data?.success === false) {
    throw new Error(data?.message || `打印失败: ${res.status}`);
  }
  return data;
}

/**
 * 用本机控件静默打印 PDF Blob。
 * 控件离线时抛错，由调用方决定是否回退浏览器。
 * 控件在线但出纸失败同样抛错（不偷偷降级）。
 */
export async function printPdfBlob(blob, agentUrl, options = {}) {
  if (!(blob instanceof Blob)) {
    throw new Error('PDF 内容无效');
  }
  await health(agentUrl);
  let cancelPreview = true;
  try {
    const cfg = await readConfig(agentUrl);
    cancelPreview = cfg.cancelPreview !== false;
  } catch (e) {
    console.warn('读取打印控件配置失败，仍尝试静默打印', e);
  }
  if (!cancelPreview) {
    throw new Error('控件未勾选「取消预览，直接静默打印」');
  }
  const base64 = await blobToBase64(blob);
  return printBase64(base64, agentUrl, options.templateId);
}

export default {
  DEFAULT_AGENT_URL,
  normalizeAgentUrl,
  health,
  readConfig,
  blobToBase64,
  printBase64,
  printPdfBlob,
};
