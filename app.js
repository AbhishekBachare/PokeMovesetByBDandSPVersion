const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/pokemon/:name', async (req, res) => {
    const pokemonName = req.params.name.toLowerCase();

    try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
        const pokemonData = response.data;

        const moveset = await Promise.all(pokemonData.moves.map(async move => {
            const moveResponse = await axios.get(move.move.url);
            const moveData = moveResponse.data;

            // Filter moveset for the "brilliant-diamond-and-shining-pearl" version
            const versionDetails = move.version_group_details.find(version => {
                return version.version_group.name === "brilliant-diamond-and-shining-pearl" && version.move_learn_method.name === "level-up";
            });

            if (versionDetails) {
                return {
                    move: moveData.name,
                    level: versionDetails.level_learned_at,
                };
            }

            return null;
        }));

        // Remove null entries (moves not learned by the specified version and method)
        const filteredMoveset = moveset.filter(move => move !== null);

        // Sort moveset by level
        const sortedMoveset = filteredMoveset.sort((a, b) => a.level - b.level);

        const result = {
            id: pokemonData.id,
            name: pokemonData.name,
            type: pokemonData.types.map(type => type.type.name),
            height: pokemonData.height / 10, // Convert to meters
            weight: pokemonData.weight / 10, // Convert to kilograms
            moveset: sortedMoveset,
        };

        res.json(result);
    } catch (error) {
        res.status(404).json({ error: 'Pokemon not found' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
