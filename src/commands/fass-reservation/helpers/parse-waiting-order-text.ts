/*
  @param {String} - text
  @return {['01', '222']}[]
*/
export const parseWaitingOrderText = (text: string) => text
  .split('\n')
  .filter(t => /^\s+(?:\d{2})\)\s+/.test(t))
  .map(t => t.trim())
  .map(t => t.split(') '));
