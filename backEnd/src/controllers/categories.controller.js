import * as categoriesService from '../services/categories.service.js';

export async function list(req, res, next) {
    try {
        const categories = await categoriesService.listCategories();
        res.json(categories);
    } catch (err) { next(err); }
}

export async function getOne(req, res, next) {
    try {
        const category = await categoriesService.getCategory(req.params.id);
        if (!category) return res.status(404).json({ error: 'Category not found' });
        res.json(category);
    } catch (err) { next(err); }
}

export async function create(req, res, next) {
    try {
        const category = await categoriesService.createCategory(req.body.category);
        res.status(201).json(category);
    } catch (err) { next(err); }
}

export async function update(req, res, next) {
    try {
        const category = await categoriesService.updateCategory(req.params.id, req.body.category);
        res.json(category);
    } catch (err) { next(err); }
}

export async function remove(req, res, next) {
    try {
        await categoriesService.deleteCategory(req.params.id);
        res.status(204).send();
    } catch (err) { next(err); }
}