const express = require('express');
const cors = require('cors');
const path = require('path');
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

//Listar 

app.get('/api/products', async (req, res) => {
    const { category } = req.query;
    try {
        let items;
        if (category) {
            items = await prisma.product.findMany({ 
                where: { category: category },
                orderBy: { id: "desc" } 
            });
        } else {
            items = await prisma.product.findMany({ orderBy: { id: "desc" } });
        }
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: "Error fetching products" });
    }
});

//Get one 

app.get("/api/products/:id", async (req, res) => {
    const id = Number(req.params.id);
    const item = await prisma.product.findUnique({ where: { id } });
    if (!item) {
        return res.status(404).json({ message: "Product not found" });
    }
    res.json(item);
});

//Create

app.post("/api/products", async (req, res) => {
    const { name, description, price, category } = req.body;
    if (!name || price === undefined ) {
        return res.status(400).json({ message: "Missing required field" });
    }
    const created = await prisma.product.create({
        data: {
            name: String(name).trim(),
            description: description ? String(description).trim() : null,
            price: Number(price),
            category: category ? String(category).trim() : null
        }
    });
    res.status(201).json(created);
});

//Update

app.put("/api/products/:id", async (req, res) => {
    const id = Number(req.params.id);
    const { name, description, price, category } = req.body;

    const update = await prisma.product.update({
        where: {id},
        data: {
            name: name === undefined ? undefined : String(name).trim(),
            description: description === undefined ? undefined: (description ? String(description).trim() : null),
            price: price === undefined ? undefined : Number(price),
            category: category === undefined ? undefined : (category ? String(category).trim() : null)
        }
    });
    res.status(201).json(update);
});

//Delete

app.delete("/api/products/:id", async (req, res) => {
    const id = Number(req.params.id);

    try {
        await prisma.product.delete({ where: { id } });
        res.status(204).send();
    } catch (error) {
        res.status(404).json({ message: "Product not found" });
    }
});

//Get all unique categories
app.get("/api/categories", async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            select: { category: true },
            distinct: ['category'],
            orderBy: { category: 'asc' }
        });
        const categories = products
            .map(p => p.category)
            .filter(cat => cat !== null && cat.trim() !== '')
            .sort();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: "Error fetching categories" });
    }
});

// in production we serve the React app from the build output
if (process.env.NODE_ENV === 'production') {
    // ensure any route that isn't /api/* returns the index.html
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });
}

app.listen(4000, () => console.log("API on http://localhost:4000"));