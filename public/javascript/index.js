const box = document.querySelectorAll('.box');
const imageName = document.querySelectorAll('.image-name');
const deleteButton = document.querySelectorAll('.delete-button');
const addButton = document.querySelector('.add-button');
const addForm = document.querySelector('.add-form');
const deleteForm = document.querySelector('.delete-form');

console.log(addButton, addForm);

for (let i = 0; i < box.length; i++) {
  box[i].addEventListener('mouseenter', () => {
    for (let i = 0; i < imageName.length; i++) {
      imageName[i].style.visibility = 'visible';
    }
    for (let i = 0; i < deleteButton.length; i++) {
      deleteButton[i].style.visibility = 'visible';
      deleteButton[i].addEventListener('click', () => {
        deleteForm.style.display = 'block';
      });
    }
  });
}

for (let i = 0; i < box.length; i++) {
  box[i].addEventListener('mouseleave', () => {
    for (let i = 0; i < imageName.length; i++) {
      imageName[i].style.visibility = 'hidden';
    }
    for (let i = 0; i < deleteButton.length; i++) {
      deleteButton[i].style.visibility = 'hidden';
    }
  });
}

addButton.addEventListener('click', () => {
  addForm.style.display = 'block';
});
