// draggable.js

document.addEventListener('DOMContentLoaded', function() {
    let draggables = document.querySelectorAll('.draggable');
    draggables.forEach(draggable => {
        let offsetX, offsetY, isDragging = false;

        draggable.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - draggable.getBoundingClientRect().left;
            offsetY = e.clientY - draggable.getBoundingClientRect().top;
            draggable.style.zIndex = 1000; // 确保拖动的元素在顶层
        });

        window.addEventListener('mousemove', (e) => {
            if (isDragging) {
                draggable.style.left = (e.clientX - offsetX) + "px";
                draggable.style.top = (e.clientY - offsetY) + "px";
            }
        });

        window.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                draggable.style.zIndex = '';
            }
        });
    });
});