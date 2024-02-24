async function searchPokemon() {
    const pokemonName = document.getElementById('pokemonName').value.toLowerCase();

    try {
        const response = await fetch(`/pokemon/${pokemonName}`);
        const pokemonData = await response.json();

        // Display Pokemon information
        const movesetHTML = pokemonData.moveset.map(move => {
            return `<li>${move.move} (Level: ${move.level})</li>`;
        }).join('');

        document.getElementById('pokemonInfo').innerHTML = `
            <p>ID: ${pokemonData.id}</p>
            <p>Name: ${pokemonData.name}</p>
            <p>Type: ${pokemonData.type.join(', ')}</p>
            <p>Height: ${pokemonData.height} meters</p>
            <p>Weight: ${pokemonData.weight} kgs</p>
            <p>Moveset (Brilliant Diamond and Shining Pearl, Level-up):</p>
            <ul>${movesetHTML}</ul>
        `;
    } catch (error) {
        console.error('Error fetching Pokemon data:', error);
        document.getElementById('pokemonInfo').innerHTML = '<p>Pokemon not found</p>';
    }
}
