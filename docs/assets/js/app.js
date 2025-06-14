// Конфигурация путей
const DATA_PATH = 'data/';
const IMG_PATH = 'assets/images/furniture/';

async function loadCatalog() {
    try {
        const response = await fetch(`${DATA_PATH}furniture.json`);
        const data = await response.json();
        renderCatalog(data.categories);
    } catch (error) {
        console.error("Ошибка загрузки каталога:", error);
        document.getElementById('catalog-container').innerHTML = `
            <div class="error">
                <p>Каталог временно недоступен</p>
                <button onclick="location.reload()">Обновить страницу</button>
            </div>
        `;
    }
}

function renderCatalog(categories) {
    const container = document.getElementById('catalog-container');
    
    container.innerHTML = categories.map(cat => `
        <div class="category-card" data-slug="${cat.slug}">
            <div class="category-icon">
                <i class="fas fa-${cat.icon}"></i>
            </div>
            <h3>${cat.name}</h3>
            <p>${cat.count} моделей</p>
        </div>
    `).join('');

    // Обработчики для карточек категорий
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', async () => {
            const slug = card.dataset.slug;
            await loadCategory(slug);
        });
    });
}

async function loadCategory(slug) {
    try {
        const response = await fetch(`${DATA_PATH}categories/${slug}.json`);
        const data = await response.json();
        renderCategory(data);
    } catch (error) {
        console.error(`Ошибка загрузки категории ${slug}:`, error);
    }
}

function renderCategory(categoryData) {
    const container = document.getElementById('catalog-container');
    container.innerHTML = `
        <button onclick="loadCatalog()">← Назад</button>
        <h2>${categoryData.category}</h2>
        <div class="items-container"></div>
    `;

    const itemsContainer = container.querySelector('.items-container');
    
    for (const [type, items] of Object.entries(categoryData.items)) {
        itemsContainer.innerHTML += `
            <h3>${type.replace('_', ' ')}</h3>
            <div class="items-grid">
                ${items.map(item => `
                    <div class="product-card">
                        <img src="${IMG_PATH}${item.model.toLowerCase()}.jpg" alt="${item.model}">
                        <h4>${item.model}</h4>
                        <p>Цена: ${item.price} ₽</p>
                    </div>
                `).join('')}
            </div>
        `;
    }
}

// Запуск при загрузке
document.addEventListener('DOMContentLoaded', loadCatalog);
