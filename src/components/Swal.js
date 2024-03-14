import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "./css/Details.css";
const swal = withReactContent(Swal);

export const modalDetails = ({ image, title, description, price }) => {
    swal.fire({
        html: `<div class="card">
        <div class="card__wrapper d-flex justify-content-between align-items-center">
            <div class="card__back"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 24" height="24" width="14"><path stroke-linejoin="round" stroke-linecap="round" stroke-width="3" stroke="#fff" d="M12 2L2 12L12 22"></path></svg></div>
            <div class="card__menu"><svg xmlns="http://www.w3.org/2000/svg" width="29" viewBox="0 0 29 14" height="14" fill="none"><path fill="#fff" d="m16.5714 9.16667h10.3572c.5493 0 1.0762.22827 1.4647.6346s.6067.95743.6067 1.53203c0 .5747-.2182 1.1258-.6067 1.5321s-.9154.6346-1.4647.6346h-10.3572c-.5493 0-1.0762-.2283-1.4647-.6346s-.6067-.9574-.6067-1.5321c0-.5746.2182-1.1257.6067-1.53203s.9154-.6346 1.4647-.6346zm-14.49997-8.66667h24.85717c.5493 0 1.0762.228273 1.4647.6346.3885.40633.6067.95743.6067 1.53207 0 .57463-.2182 1.12573-.6067 1.53206s-.9154.6346-1.4647.6346h-24.85717c-.54938 0-1.076254-.22827-1.464722-.6346s-.606708-.95743-.606708-1.53206c0-.57464.21824-1.12574.606708-1.53207.388468-.406327.915342-.6346 1.464722-.6346z"></path></svg></div>
        </div>
        <img class="card__img img-fluid rounded" src="${image}" />
        <div class="card__title">${title}</div>
        <div class="card__subtitle text-break">${description}</div>
        <div class="card__wrapper d-flex justify-content-between align-items-center">
            <div class="card__price">$${price}</div>
            <div class="card__counter d-flex align-items-center">
                <button class="card__btn btn btn-light">-</button>
                <div class="card__counter-score mx-2">2</div>
                <button class="card__btn card__btn-plus btn btn-light">+</button>
            </div>
        </div>
        </div>`,
        showConfirmButton: false,
        width: '30%', // Ajustado para mayor responsividad
        showCloseButton: false,
        background: 'transparent',
        didOpen: () => {
            // Agrega un evento de clic al botón de cierre
            const closeButton = document.querySelector('.card__back');
            closeButton.addEventListener('click', () => {
                swal.close(); // Cierra el SweetAlert
            });
        },
    });
};


