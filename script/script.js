// 'use strict';

const dataBase = JSON.parse(localStorage.getItem('awito')) || [];

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

const renderCard = () => {
    catalog.textContent = '';
    dataBase.forEach((item, i) => {
        //Именно доавляем HTML
        catalog.insertAdjacentHTML('beforeend', `
        <li class="card" data-id="${i}">
            <img class="card__image" src="data:image/jpeg;base64,${item.image}" alt="test">
            <div class="card__description">
                <h3 class="card__header">${item.nameItem}</h3>
                <div class="card__price">${item.costItem} ₽</div>
            </div>
        </li>
        `);
    });
};

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
    if (target.closest('.card')){
        renderItemCard();
        modalItem.classList.remove('hide');

        document.addEventListener('keydown', closeModalEsc);
    }
});

// modalAdd.addEventListener('click', event => {
//     const target = event.target;
//     if(target.classList.contains('modal__close') ||
//     target === modalAdd){
//         modalAdd.classList.add('hide')
//         modalSubmit.reset();
//     }
// });
const renderItemCard = () => {
    modalItem.textContent = '';
    dataBase.findIndex((item, ${item.index}) => {
        //Именно доавляем HTML
        modalItem.insertAdjacentHTML('beforeend', `
<!--            <div class="modal modal__item hide">-->
                <div class="modal__block" data-id="${i}">
                    <h2 class="modal__header">Купить</h2>
                    <div class="modal__content">
                        <div><img class="modal__image modal__image-item" src="data:image/jpeg;base64,${item.image}" alt="test"></div>
                        <div class="modal__description">
                            <h3 class="modal__header-item">${item.nameItem}</h3>
                            <p>Состояние: <span class="modal__status-item">отличное</span></p>
                            <p>Описание:
                                <span class="modal__description-item">${item.descriptionItem}</span>
                            </p>
                            <p>Цена: <span class="modal__cost-item">${item.costItem} ₽</span></p>
                            <button class="btn">Купить</button>
                        </div>
                    </div>
                    <button class="modal__close">&#10008;</button>
                </div>
<!--            </div>    -->
        `);
    });
};
modalItem.addEventListener('change', event => {
    renderItemCard();
});
modalAdd.addEventListener('click', closeModalEsc);
modalItem.addEventListener('click', closeModalEsc);

renderCard();
