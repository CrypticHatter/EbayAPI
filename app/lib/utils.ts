export const generatePagination = (currentPage: number, totalPages: number) => {
  // Limit the maximum pages we'll show in pagination to prevent UI issues
  const maxDisplayPages = 10000; // Reasonable limit for practical navigation
  const effectiveTotalPages = Math.min(totalPages, maxDisplayPages);
  
  // If the total number of pages is 15 or less, display all pages without any ellipsis.
  if (effectiveTotalPages <= 15) {
    return Array.from({ length: effectiveTotalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 7 pages,
  // show the first 9 pages, an ellipsis, and the last 2 pages.
  if (currentPage <= 7) {
    return [1, 2, 3, 4, 5, 6, 7, 8, 9, "...", effectiveTotalPages - 1, effectiveTotalPages];
  }

  // If the current page is among the last 7 pages,
  // show the first 2 pages, an ellipsis, and the last 9 pages.
  if (currentPage >= effectiveTotalPages - 6) {
    return [
      1, 
      2, 
      "...", 
      effectiveTotalPages - 8,
      effectiveTotalPages - 7,
      effectiveTotalPages - 6,
      effectiveTotalPages - 5,
      effectiveTotalPages - 4,
      effectiveTotalPages - 3,
      effectiveTotalPages - 2, 
      effectiveTotalPages - 1, 
      effectiveTotalPages
    ];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, 7 pages around current page,
  // another ellipsis, and the last page.
  return [
    1,
    "...",
    currentPage - 3,
    currentPage - 2,
    currentPage - 1,
    currentPage,
    currentPage + 1,
    currentPage + 2,
    currentPage + 3,
    "...",
    effectiveTotalPages,
  ];
};

export const calcDuration = (input: string) => {
  var today: any = new Date();
  var endDate: any = new Date(input);
  var diffMs = Math.abs(endDate - today);
  var diffDays = Math.floor(diffMs / 86400000); // days
  var diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
  var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
  return diffDays + "d " + diffHrs + "h " + diffMins + "m";
};
