import { addTemplate, editTemplate, removeTemplate, toggleTemplateFavorite } from '../templates-archive.js';

export const createTemplateActions = ({ getState, setState, updateTemplateArchive, copyToClipboardSafe }) => ({
  onTemplateSave: async ({ id, title, content, category }) => {
    const result = await updateTemplateArchive((archive) => (
      id
        ? editTemplate({ archive, id, title, content, category })
        : addTemplate({ archive, title, content, category })
    ));
    if (result.ok) {
      setState({ templateDraft: { id: null, title: '', content: '', category: 'Textbaustein' } });
    }
    return result;
  },
  onTemplateStartEdit: (id) => {
    const item = (getState().templateArchive?.items || []).find((entry) => entry.id === id);
    if (!item) return;
    setState({ templateDraft: { id: item.id, title: item.title, content: item.content, category: item.category } });
  },
  onTemplateDelete: (id) => updateTemplateArchive((archive) => removeTemplate({ archive, id })),
  onTemplateToggleFavorite: (id) => updateTemplateArchive((archive) => toggleTemplateFavorite({ archive, id })),
  onTemplateCopy: async (id) => {
    const item = (getState().templateArchive?.items || []).find((entry) => entry.id === id);
    if (!item) {
      return { ok: false, code: 'TEMPLATE_MISSING', message: 'Vorlage wurde nicht gefunden.' };
    }
    await copyToClipboardSafe(item.content);
    setState({ templateFeedback: { message: `„${item.title}“ wurde kopiert.`, type: 'success', until: Date.now() + 3000 } });
    setTimeout(() => {
      const state = getState();
      if (state.templateFeedback?.until && state.templateFeedback.until <= Date.now()) {
        setState({ templateFeedback: null });
      }
    }, 3200);
    return { ok: true, code: 'TEMPLATE_COPIED', message: 'Vorlage wurde in die Zwischenablage kopiert.' };
  },
  onTemplateResetDraft: () => {
    setState({ templateDraft: { id: null, title: '', content: '', category: 'Textbaustein' } });
  }
});
