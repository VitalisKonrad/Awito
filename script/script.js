// 'use strict';
const dataBase = [];

const modalAdd = document.querySelector('.modal__add'),
    addAd = document.querySelector('.add__ad'),
    modalBtnSubmit = document.querySelector('.modal__btn-submit'),
    modalSubmit = document.querySelector('.modal__submit'),
    catalog = document.querySelector('.catalog'),
    modalItem = document.querySelector('.modal__item'),
    modalBtnWarning = document.querySelector('.modal__btn-warning');

const elementsModalSubmit = [...modalSubmit.elements]
   .filter(elem => elem.tagName !== 'BUTTON' && elem.type !== 'submit');

const checkForm = () =>{
    const validForm = elementsModalSubmit.every(elem => elem.value);
    modalBtnSubmit.disabled = !validForm;
    modalBtnWarning.style.display = validForm ? 'none' : '';
}

const closeModalEsc = (event) => {
    const target = event.target;
    
    if (target.closest('.modal__close') ||
        target.classList.contains('modal') ||
        event.code === 'Escape') {
            modalAdd.classList.add('hide');
            modalItem.classList.add('hide');
            //Прекращаем прослушивание функции, чтобы не считать esc при уже закрытом модальном окне
            document.removeEventListener('keydown', closeModalEsc);
            modalSubmit.reset();
            checkForm();
        }
};

modalSubmit.addEventListener('input', checkForm);

modalSubmit.addEventListener('submit', event=> {
    event.preventDefault();
    const itemObj = {};
    for (const elem of elementsModalSubmit){
        itemObj[elem.name] = elem.value;
    }
    dataBase.push(itemObj);
    closeModalEsc({target: modalAdd});
    console.log(dataBase)
});

addAd.addEventListener('click', () => {
    modalAdd.classList.remove('hide'),
    modalBtnSubmit.disabled = true;
    document.addEventListener('keydown', closeModalEsc);
});

catalog.addEventListener('click', event => {
    const target = event.target;
    if (target.closest('.card')){
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
modalAdd.addEventListener('click', closeModalEsc);
modalItem.addEventListener('click', closeModalEsc);
