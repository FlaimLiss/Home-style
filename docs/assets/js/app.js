// Конфигурация путей
const DATA_PATH = 'data/';
const IMG_PATH = 'assets/images/';

// 1. Загрузка данных категорий
async function loadCategories() {
  try {
    const response = await fetch(`${DATA_PATH}furniture.json`);
    if (!response.ok) throw new Error('Ошибка загрузки категорий');
    return await response.json();
  } catch (error) {
    console.error('Не удалось загрузить категории:', error);
    return null;
  }
}

// 2. Загрузка данных конкретной категории
async function loadCategoryData(slug) {
  try {
    const response = await fetch(`${DATA_PATH}categories/${slug}.json`);
    if (!response.ok) throw new Error(`Ошибка загрузки ${slug}`);
    return await response.json();
  } catch (error) {
    console.error(`Не удалось загрузить ${slug}:`, error);
    return null;
  }
}

// 3. Рендер главной страницы с категориями
function renderMainPage(categories) {
  const container = document.getElementById('catalog-container');
  
  categories.forEach(category => {
    const categoryHTML = `
      <div class="category-card" data-slug="${category.slug}">
        <div class="category-icon">
          <i class="fas fa-${category.icon}"></i>
        </div>
        <h3>${category.name}</h3>
        <p>${category.count} моделей</p>
      </div>
    `;
    container.innerHTML += categoryHTML;
  });

  // Добавляем обработчики событий
  document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', async () => {
      const slug = card.getAttribute('data-slug');
      const categoryData = await loadCategoryData(slug);
      if (categoryData) renderCategoryPage(categoryData);
    });
  });
}

// 4. Рендер страницы категории
function renderCategoryPage(categoryData) {
  const container = document.getElementById('catalog-container');
  container.innerHTML = `
    <button id="back-button">← Назад</button>
    <h1>${categoryData.category}</h1>
  `;

  // Рендер подкатегорий
  for (const [subcategory, items] of Object.entries(categoryData.items)) {
    container.innerHTML += `
      <div class="subcategory">
        <h2>${subcategory.replace('_', ' ')}</h2>
        <div class="items-grid">
          ${items.map(item => `
            <div class="item-card">
              <img src="${IMG_PATH}${item.model.toLowerCase()}.jpg" alt="${item.model}">
              <h3>${item.model}</h3>
              <p>Цена: ${item.price.toLocaleString()} руб.</p>
              <div class="features">
                ${item.features.map(f => `<span>${f}</span>`).join('')}
              </div>
              <button class="details-btn" data-id="${item.id}">Подробнее</button>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // Обработчик кнопки "Назад"
  document.getElementById('back-button').addEventListener('click', async () => {
    const categories = await loadCategories();
    if (categories) {
      container.innerHTML = '';
      renderMainPage(categories.categories);
    }
  });

  // Обработчики кнопок "Подробнее"
  document.querySelectorAll('.details-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const itemId = btn.getAttribute('data-id');
      // Здесь можно реализовать модальное окно с деталями
      console.log(`Открыть детали товара ID: ${itemId}`);
    });
  });
}

// 5. Инициализация
document.addEventListener('DOMContentLoaded', async () => {
  const categoriesData = await loadCategories();
  if (categoriesData) {
    renderMainPage(categoriesData.categories);
  }
});
