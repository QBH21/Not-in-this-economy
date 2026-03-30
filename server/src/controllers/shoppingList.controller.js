import { ShoppingListModel } from '../models/shoppingList.model.js'

export async function getLists(req, res, next) {
  try {
    const lists = await ShoppingListModel.findAll(req.user.id)
    res.json(lists)
  } catch (err) {
    next(err)
  }
}

export async function getList(req, res, next) {
  try {
    const list = await ShoppingListModel.findById(req.params.id, req.user.id)
    if (!list) return res.status(404).json({ error: 'List not found' })
    const items = await ShoppingListModel.getItems(req.params.id)
    res.json({ ...list, items })
  } catch (err) {
    next(err)
  }
}

export async function createList(req, res, next) {
  try {
    const list = await ShoppingListModel.create(req.body.name, req.user.id)
    res.status(201).json(list)
  } catch (err) {
    next(err)
  }
}

export async function updateList(req, res, next) {
  try {
    const list = await ShoppingListModel.update(req.params.id, req.body.name, req.user.id)
    if (!list) return res.status(404).json({ error: 'List not found' })
    res.json(list)
  } catch (err) {
    next(err)
  }
}

export async function deleteList(req, res, next) {
  try {
    await ShoppingListModel.delete(req.params.id, req.user.id)
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
}

export async function addItem(req, res, next) {
  try {
    const list = await ShoppingListModel.findById(req.params.id, req.user.id)
    if (!list) return res.status(404).json({ error: 'List not found' })
    const item = await ShoppingListModel.addItem(req.params.id, req.body)
    res.status(201).json(item)
  } catch (err) {
    next(err)
  }
}

export async function updateItem(req, res, next) {
  try {
    const list = await ShoppingListModel.findById(req.params.id, req.user.id)
    if (!list) return res.status(404).json({ error: 'List not found' })
    const item = await ShoppingListModel.updateItem(req.params.itemId, req.body)
    if (!item) return res.status(404).json({ error: 'Item not found' })
    res.json(item)
  } catch (err) {
    next(err)
  }
}

export async function deleteItem(req, res, next) {
  try {
    const list = await ShoppingListModel.findById(req.params.id, req.user.id)
    if (!list) return res.status(404).json({ error: 'List not found' })
    await ShoppingListModel.deleteItem(req.params.itemId)
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
}
