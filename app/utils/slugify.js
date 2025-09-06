export const slugify = text => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/^-+|-+$/g, '') || 'draft'; // Fallback to 'draft' if empty
}