import multer from 'multer';

const multerInstance = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per file
});

// Used on POST /api/recipes — hero photo + any step photos, submitted together
export const uploadRecipeMedia = multerInstance.fields([
    { name: 'heroImage', maxCount: 1 },
    { name: 'stepImages', maxCount: 20 },
]);

// Used on POST /api/recipes/:id/images — adding a single photo after the

export const uploadSingleImage = multerInstance.fields([
    { name: 'image', maxCount: 1 },
]);