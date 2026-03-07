const normalizeLineBreaks = (value) => String(value || '').replace(/\r\n?/g, '\n');

const trimTrailingSpaces = (value) => normalizeLineBreaks(value)
  .split('\n')
  .map((line) => line.replace(/[ \t]+$/g, ''))
  .join('\n')
  .trimEnd();

const withFinalLineBreak = (value) => {
  const text = trimTrailingSpaces(value);
  return text ? `${text}\n` : '';
};

const formatJson = (value) => {
  const parsed = JSON.parse(value);
  return `${JSON.stringify(parsed, null, 2)}\n`;
};

const formatLineBasedCode = (value) => {
  const lines = normalizeLineBreaks(value).split('\n');
  let indentLevel = 0;
  const formatted = lines.map((line) => {
    const clean = line.trim();
    if (!clean) return '';

    if (/^[}\])]/.test(clean)) {
      indentLevel = Math.max(0, indentLevel - 1);
    }

    const output = `${'  '.repeat(indentLevel)}${clean}`;

    if (/[{[(]$/.test(clean) && !/^\/\//.test(clean)) {
      indentLevel += 1;
    }

    return output;
  });

  return withFinalLineBreak(formatted.join('\n'));
};

const formatHtml = (value) => {
  const lines = normalizeLineBreaks(value).split('\n');
  let indentLevel = 0;
  const formatted = lines.map((line) => {
    const clean = line.trim();
    if (!clean) return '';

    if (/^<\//.test(clean) || /^<[^>]+\/>$/.test(clean)) {
      indentLevel = Math.max(0, indentLevel - (/^<\//.test(clean) ? 1 : 0));
    }

    const output = `${'  '.repeat(indentLevel)}${clean}`;

    if (/^<[^!/][^>]*[^/]?>$/.test(clean) && !/^<\/.*>$/.test(clean) && !/.*<\/.*>$/.test(clean)) {
      indentLevel += 1;
    }

    return output;
  });

  return withFinalLineBreak(formatted.join('\n'));
};

const extensionFromPath = (path = '') => {
  const fileName = String(path || '').trim().split('/').pop() || '';
  const parts = fileName.split('.');
  return parts.length > 1 ? parts.pop().toLowerCase() : '';
};

export const formatEditorContentForPath = ({ path = '', content = '' } = {}) => {
  const extension = extensionFromPath(path);
  const text = String(content || '');

  if (!text.trim()) {
    return { ok: true, code: 'FORMAT_SKIPPED_EMPTY', message: 'Datei ist leer.', data: { changed: false, content: '' } };
  }

  try {
    let formatted = withFinalLineBreak(text);
    if (extension === 'json') formatted = formatJson(text);
    else if (extension === 'js' || extension === 'css') formatted = formatLineBasedCode(text);
    else if (extension === 'html') formatted = formatHtml(text);

    const changed = formatted !== text;
    return {
      ok: true,
      code: changed ? 'FORMAT_APPLIED' : 'FORMAT_UNCHANGED',
      message: changed ? 'Code wurde automatisch formatiert.' : 'Code war bereits formatiert.',
      data: { changed, content: formatted, extension }
    };
  } catch (error) {
    return {
      ok: false,
      code: 'FORMAT_FAILED',
      message: 'Automatische Formatierung ist fehlgeschlagen.',
      data: { error: String(error), extension }
    };
  }
};
