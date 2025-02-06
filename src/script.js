// Seleciona os elementos do DOM
const BarraPesquisa = document.querySelector('#PesquisarPokemon');
const pokemonImage = document.querySelector('#pokemon_image');
const pokemonName = document.querySelector('#exibirnomepokemon');
const pokemonDetails = document.querySelector('#pokemon_details'); // Novo contêiner para especificações no CSS
const backButton = document.querySelector('#back_button');
const nextButton = document.querySelector('#next_button');

// ID atual do Pokémon (iniciamos com 1 - Bulbasaur)
let currentPokemonId = 1;

// Função para buscar Pokémon por ID ou nome
async function buscarPokemon(pokemon) {
    try {
        const apiUrl = `https://pokeapi.co/api/v2/pokemon/${pokemon.toString().toLowerCase()}`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error('Pokémon não encontrado');
        }

        const data = await response.json();

        // Atualiza a imagem, o nome e o ID atual
        currentPokemonId = data.id; 
        pokemonImage.src = data.sprites.front_default;
        pokemonImage.alt = data.name;
        pokemonName.textContent = data.name.charAt(0).toUpperCase() + data.name.slice(1); // Nome formatado

        // Exibe as especificações do Pokémon
        mostrarEspecificacoes(data);

        // Mostra o contêiner da imagem
        document.querySelector('.imagepokemon').style.visibility = 'visible';
        document.querySelector('.imagepokemon').style.height = 'auto';
    } catch (error) {
        console.warn('Pokémon não encontrado. Verificando se é um erro esperado...');
        pokemonImage.src = '';
        pokemonImage.alt = '';
        pokemonName.textContent = '';
        pokemonDetails.innerHTML = ''; // Limpa as especificações
        document.querySelector('.imagepokemon').style.visibility = 'hidden';
        document.querySelector('.imagepokemon').style.height = '0';
    }
}

// Função para exibir as especificações do Pokémon
function mostrarEspecificacoes(pokemonData) {
    const types = pokemonData.types.map(type => type.type.name).join(', '); // Tipos
    const abilities = pokemonData.abilities.map(ability => ability.ability.name).join(', '); // Habilidades
    const height = pokemonData.height / 10; // Convertendo para metros
    const weight = pokemonData.weight / 10; // Convertendo para kg

    // Exibindo as especificações no HTML
    pokemonDetails.innerHTML = `
        <p><strong>Tipos:</strong> ${types}</p>
        <p><strong>Habilidades:</strong> ${abilities}</p>
        <p><strong>Altura:</strong> ${height} m</p>
        <p><strong>Peso:</strong> ${weight} kg</p>
    `;
}

// Função para navegar entre IDs (Próximo/Voltar)
async function navegarPokemon(offset) {
    const novoId = currentPokemonId + offset;
    if (novoId < 1) {
        alert('Já estamos no primeiro Pokémon!');
        return;
    }
    await buscarPokemon(novoId); // Busca o Pokémon pelo novo ID
}

// Eventos dos botões de navegação que retorna e continua a busca pelos pokemons
backButton.addEventListener('click', () => {
    navegarPokemon(-1); 
});

nextButton.addEventListener('click', () => {
    navegarPokemon(1); 
});

// Evento no campo de pesquisa para buscar por nome
BarraPesquisa.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const nomePokemon = BarraPesquisa.value.trim();
        if (nomePokemon) {
            buscarPokemon(nomePokemon);
        } else {
            alert('Por favor, insira o nome de um Pokémon!');
        }
    }
});

// Carrega o primeiro Pokémon (Bulbasaur) ao abrir a página
buscarPokemon(currentPokemonId);
