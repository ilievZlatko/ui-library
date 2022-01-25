/**
 * Measures the width of the provided text in pixels
 * according to the current page's default text style.
 *
 * @param text The text to measure.
 * @param style CSS Style to apply before measuring.
 * @returns The width of the text in px as a string.
 */
function getTextWidthInPx(text: string, style?: Partial<CSSStyleDeclaration>): string {
  const width = getTextWidth(text, style);

  return `${width}px`;
}

/**
 * Measures the width of the provided text in pixels
 * according to the current page's default text style.
 *
 * @param text The text to measure.
 * @param style CSS Style to apply before measuring.
 * @returns The width of the text in px as a number.
 */
function getTextWidth(text: string, style?: Partial<CSSStyleDeclaration>): number {
  const measure = document.createElement('div');
  measure.style.cssText = 'position:absolute; visibility:hidden';
  Object.assign(measure.style, style);
  measure.innerText = text;

  document.body.appendChild(measure);
  const width = parseInt(window.getComputedStyle(measure).width!);
  document.body.removeChild(measure);

  return Math.max(10, width);
}

export { getTextWidthInPx, getTextWidth };
