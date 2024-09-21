export const formatContent = (content: string, maxLength: number): string => {
  return content.slice(0, maxLength) + "...";
};
