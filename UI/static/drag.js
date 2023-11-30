// drag.js
document.addEventListener('DOMContentLoaded', function() {
    let draggable = document.querySelector('.draggable');
    let offsetX, offsetY, isDragging = false;

    draggable.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - draggable.getBoundingClientRect().left;
        offsetY = e.clientY - draggable.getBoundingClientRect().top;
    });

    window.addEventListener('mousemove', (e) => {
        if (isDragging) {
            draggable.style.left = (e.clientX - offsetX) + "px";
            draggable.style.top = (e.clientY - offsetY) + "px";
        }
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
    });
});
