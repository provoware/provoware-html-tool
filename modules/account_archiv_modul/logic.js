const normalizeText = (value) => String(value || '').replace(/\s+/g, ' ').trim();

const normalizeTags = (value) => {
  const values = Array.isArray(value) ? value : String(value || '').split(',');
  return [...new Set(values.map((item) => normalizeText(item)).filter(Boolean))];
};

const normalizeUrl = (value) => {
  const text = normalizeText(value);
  if (!text) return '';
  try {
    const parsed = new URL(text);
    return parsed.href;
  } catch {
    return '';
  }
};

export const sanitizeCustomFields = (customFields) => {
  if (!Array.isArray(customFields)) return [];
  return customFields
    .map((field) => ({ label: normalizeText(field?.label), value: normalizeText(field?.value) }))
    .filter((field) => field.label && field.value);
};

export const validateAccountTitleInput = (input) => {
  const title = normalizeText(input?.title);
  if (!title) {
    return { ok: false, code: 'ACCOUNT_TITLE_EMPTY', message: 'Bitte einen Titel eingeben.' };
  }
  return { ok: true, title, tags: normalizeTags(input?.tags) };
};

export const buildAccountProfilePayload = (input = {}) => {
  const profileName = normalizeText(input.profileName);
  if (!profileName) {
    return { ok: false, code: 'ACCOUNT_PROFILE_EMPTY', message: 'Bitte einen Profilnamen eingeben.' };
  }
  return {
    ok: true,
    profile: {
      profileName,
      loginEmail: normalizeText(input.loginEmail),
      websiteUrl: normalizeUrl(input.websiteUrl),
      username: normalizeText(input.username),
      notes: normalizeText(input.notes),
      tags: normalizeTags(input.tags),
      customFields: sanitizeCustomFields(input.customFields)
    }
  };
};

export const buildAccountSearchText = (account) => {
  const profiles = Array.isArray(account?.profiles) ? account.profiles : [];
  const fields = profiles.flatMap((profile) => [
    profile?.profileName,
    profile?.loginEmail,
    profile?.websiteUrl,
    profile?.username,
    profile?.notes,
    ...(Array.isArray(profile?.tags) ? profile.tags : []),
    ...(Array.isArray(profile?.customFields) ? profile.customFields.flatMap((field) => [field?.label, field?.value]) : [])
  ]);
  return normalizeText([account?.title, ...(Array.isArray(account?.tags) ? account.tags : []), ...fields].join(' ')).toLowerCase();
};

export const findDuplicateProfileName = (profiles, profileName, exceptId = '') => {
  const lookup = normalizeText(profileName).toLowerCase();
  return (profiles || []).some((profile) => profile.id !== exceptId && normalizeText(profile.profileName).toLowerCase() === lookup);
};
