// 'use strict';

const dataBase = JSON.parse(localStorage.getItem('awito')) || [];
let counter = 0;
const modalAdd = document.querySelector('.modal__add'),
    addAd = document.querySelector('.add__ad'),
    modalBtnSubmit = document.querySelector('.modal__btn-submit'),
    modalSubmit = document.querySelector('.modal__submit'),
    catalog = document.querySelector('.catalog'),
    modalItem = document.querySelector('.modal__item'),
    modalBtnWarning = document.querySelector('.modal__btn-warning'),
    modalFileInput = document.querySelector('.modal__file-input'),
    modalFileBtn = document.querySelector('.modal__file-btn'),
    modalImageAdd = document.querySelector('.modal__image-add');

const modalImageItem = document.querySelector('.modal__image-item'),
    modalHeaderItem = document.querySelector('.modal__header-item'),
    modalStatusItem = document.querySelector('.modal__status-item'),
    modalDescriptionItem = document.querySelector('.modal__description-item'),
    modalCostItem = document.querySelector('.modal__cost-item');

const searchInput = document.querySelector('.search__input'),
   menuContainer = document.querySelector('.menu__container');

//Запоминаем дефолтную картинку и надпись при добавлении фотографии
const textFileBtn = modalFileBtn.textContent;
const srcModalImage = modalImageAdd.src;

const elementsModalSubmit = [...modalSubmit.elements]
   .filter(elem => elem.tagName !== 'BUTTON' && elem.type !== 'submit');

const infoPhoto = {};

const saveDB = () => localStorage.setItem('awito', JSON.stringify(dataBase));

const checkForm = () =>{
    const validForm = elementsModalSubmit.every(elem => elem.value);
    modalBtnSubmit.disabled = !validForm;
    modalBtnWarning.style.display = validForm ? 'none' : '';
};

const closeModalEsc = (event) => {
    const target = event.target;
    
    if (target.closest('.modal__close') ||
        target.classList.contains('modal') ||
        event.code === 'Escape') {
            modalAdd.classList.add('hide');
            modalItem.classList.add('hide');
            //Прекращаем прослушивание функции, чтобы не считать esc при уже закрытом модальном окне
            document.removeEventListener('keydown', closeModalEsc);
            // Очистка формы и возвращение надписи про заполнение всех полей
            modalSubmit.reset();
            modalImageAdd.src = srcModalImage;
            modalFileBtn.textContent = textFileBtn;
            checkForm();
        }
};
//С версии 6 выводим то, что по умолчанию если пусто
const renderCard = (DB=dataBase) => {
    catalog.textContent = '';
    DB.forEach((item) => {
        //Именно доавляем HTML
        catalog.insertAdjacentHTML('beforeend', `
        <li class="card" data-id="${item.id}">
            <img class="card__image" src="data:image/jpeg;base64,${item.image}" alt="test">
            <div class="card__description">
                <h3 class="card__header">${item.nameItem}</h3>
                <div class="card__price">${item.costItem} ₽</div>
            </div>
        </li>
        `);
    });
};

searchInput.addEventListener('input', event => {
    //Обрезаем пробелы в начале и конце, а также делаем нижний регистр
    const valueSearch = (searchInput.value.trim().toLowerCase());
    if (valueSearch.length >2) {
        const result = dataBase.filter(item => item.nameItem.toLowerCase().includes(valueSearch) ||
                                        item.descriptionItem.toLowerCase().includes(valueSearch));
        renderCard(result);
    }
})

modalFileInput.addEventListener('change', event => {
    const target = event.target;
    const reader = new FileReader();
    const file = target.files[0];
    
    infoPhoto.filename = file.name;
    infoPhoto.size = file.size;
    reader.readAsBinaryString(file);
    reader.addEventListener('load', event => {
        if (infoPhoto.size < 2000000) {
            modalFileBtn.textContent = infoPhoto.filename;
            //Конвертируем картинку в строку
            infoPhoto.base64 = btoa(event.target.result);
            modalImageAdd.src = `data:image/jpeg;base64,${infoPhoto.base64}`;
        }
        else{
            modalFileBtn.textContent = 'картинка больше 2Мб';
            modalFileInput.value = '';
            checkForm();
        }

    });
    
});

modalSubmit.addEventListener('input', checkForm);

modalSubmit.addEventListener('submit', event=> {
    //Предотвращаем перезагрузку страницы после  submit`a
    event.preventDefault();
    const itemObj = {};

    for (const elem of elementsModalSubmit){
        itemObj[elem.name] = elem.value;
        
    }
    itemObj.id = counter++;
    itemObj.image = infoPhoto.base64;
    dataBase.push(itemObj);
    //Замена eventa путем вставки пустого объекта и передачи свойства target
    closeModalEsc({target: modalAdd});
    saveDB();
    renderCard();
    // console.log(dataBase);
});

addAd.addEventListener('click', () => {
    modalAdd.classList.remove('hide');
    modalBtnSubmit.disabled = true;
    document.addEventListener('keydown', closeModalEsc);
});

catalog.addEventListener('click', event => {
    const target = event.target;
    const card = target.closest('.card');
    
    if (card) {
        //Получаем id карточки. Поскольку card.dataset.id это строка, то преобразуем в число
        const item = dataBase.find(item => item.id === +card.dataset.id);
        // console.log(item)
        modalImageItem.src = `data:image/jpeg;base64,${item.image}`;
        modalHeaderItem.textContent = item.nameItem;
        modalStatusItem.textContent = item.status === 'new' ? 'Новый' : 'Б/У';
        modalDescriptionItem.textContent = item.descriptionItem;
        modalCostItem.textContent = item.costItem;
        
        modalItem.classList.remove('hide');
        document.addEventListener('keydown', closeModalEsc);
    }
});

menuContainer.addEventListener('click', event => {
    const target = event.target;
    if (target.tagName === 'A') {
        const result = dataBase.filter(item => item.category === target.dataset.category);
        renderCard(result);
    }
});

modalAdd.addEventListener('click', closeModalEsc);
modalItem.addEventListener('click', closeModalEsc);

renderCard();
