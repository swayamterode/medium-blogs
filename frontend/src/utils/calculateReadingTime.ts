export const calculateReadingTime = (content: string): string => {
  const minutes = Math.ceil(content.length / 100);
  return minutes <= 1 ? "1 min read" : `${minutes} min read`;
};
