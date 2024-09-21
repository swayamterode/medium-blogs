export const getInitials = (authorName: string): string => {
  const nameParts = authorName.split(" ");
  if (authorName.length === 0) {
    return "U";
  }
  if (nameParts.length === 1) {
    return nameParts[0][0].toUpperCase();
  } else if (nameParts.length === 2) {
    return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
  } else {
    return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
  }
};