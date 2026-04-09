// Get technician's numeric rating value
export const getTechnicianRating = (technician) => 
  Number(technician?.avgRating || technician?.averageRating || 0);

// Get the review count for a technician
export const getTechnicianReviewCount = (technician) => 
  Number(technician?.totalReviews || technician?.reviewCount || 0);

// Review presence is source of truth for "rated vs new"
export const hasValidRating = (technician) => 
  getTechnicianReviewCount(technician) > 0;

// Format rating for display - returns "New" for unrated technicians
export const formatRatingDisplay = (technician) => {
  if (!hasValidRating(technician)) {
    return "New";
  }
  return getTechnicianRating(technician).toFixed(1);
};

// Calculate average rating excluding technicians with no reviews
export const calculateAverageRating = (technicians = []) => {
  const ratedTechnicians = technicians.filter(hasValidRating);
  
  if (ratedTechnicians.length === 0) {
    return null;
  }
  
  const sum = ratedTechnicians.reduce((acc, tech) => acc + getTechnicianRating(tech), 0);
  return Number((sum / ratedTechnicians.length).toFixed(1));
};

export const getTechnicianCity = (technician) => 
  technician?.location?.city || technician?.user?.location?.city || "N/A";

export const getTechnicianName = (technician) => 
  technician?.user?.fullName || "Technician";

export const getTechnicianService = (technician) =>
  Array.isArray(technician?.services) && technician.services.length > 0
    ? technician.services[0]?.serviceName || "Home Service Expert"
    : "Home Service Expert";

// Sort technicians by rating - unrated technicians go last
export const sortTechniciansByRating = (technicians = []) =>
  technicians.slice().sort((a, b) => {
    const aHasRating = hasValidRating(a);
    const bHasRating = hasValidRating(b);
    
    // If one has rating and other doesn't, rated one comes first
    if (aHasRating && !bHasRating) return -1;
    if (!aHasRating && bHasRating) return 1;
    
    // Both have ratings or both don't - sort by rating value
    return getTechnicianRating(b) - getTechnicianRating(a);
  });
