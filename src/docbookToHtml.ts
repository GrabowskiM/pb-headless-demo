const TAG_MAP: Record<string, string> = {
    itemizedlist: 'ul',
    listitem: 'li',
    literal: 'code',
    orderedlist: 'ol',
    para: 'p',
};

const DEFAULT_HEADING_LEVEL = '2';

const convertTitles = (xml: string): string =>
    xml.replace(/<title\b([^>]*)>([\s\S]*?)<\/title>/g, (_match, attributes: string, content: string) => {
        const [, level = DEFAULT_HEADING_LEVEL] = /level="([1-6])"/.exec(attributes) ?? [];

        return `<h${level}>${content}</h${level}>`;
    });

const convertEmphasis = (xml: string): string =>
    xml
        .replace(/<emphasis\b[^>]*role="strong"[^>]*>([\s\S]*?)<\/emphasis>/g, '<strong>$1</strong>')
        .replace(/<emphasis\b[^>]*>([\s\S]*?)<\/emphasis>/g, '<em>$1</em>');

const convertLinks = (xml: string): string =>
    xml.replace(/<link\b[^>]*xlink:href="([^"]*)"[^>]*>/g, '<a href="$1">').replace(/<\/link>/g, '</a>');

const convertMappedTags = (xml: string): string =>
    Object.entries(TAG_MAP).reduce(
        (result, [docbook, html]) =>
            result.replace(new RegExp(`<${docbook}\\b[^>]*>`, 'g'), `<${html}>`).replace(new RegExp(`</${docbook}>`, 'g'), `</${html}>`),
        xml,
    );

export const docbookToHtml = (value: string): string => {
    if (!value.includes('docbook.org')) {
        return value;
    }

    return convertMappedTags(convertLinks(convertEmphasis(convertTitles(value))))
        .replace(/<\?xml[^>]*\?>\s*/g, '')
        .replace(/<\/?section\b[^>]*>/g, '')
        .replace(/\s(?:ezxhtml|ezcustom|xlink):[\w-]+="[^"]*"/g, '');
};
