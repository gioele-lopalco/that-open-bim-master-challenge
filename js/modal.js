const modal = document.getElementById('new-project-modal')
const openModalBtn = document.querySelector('header button')
const cancelBtn = document.querySelector('.btn-secondary')

function openModal() {
    modal.showModal()
    console.log('modal opened')
}

function closeModal() {
    modal.close()
    console.log('modal closed')
}

openModalBtn.addEventListener('click', openModal)
cancelBtn.addEventListener('click', closeModal)

modal.addEventListener('click', (e) => {
    const dialogDimensions = modal.getBoundingClientRect()
    if (
        e.clientX < dialogDimensions.left ||
        e.clientX > dialogDimensions.right ||
        e.clientY < dialogDimensions.top ||
        e.clientY > dialogDimensions.bottom
    ) {
        modal.close()
    }
})