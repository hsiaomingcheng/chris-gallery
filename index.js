function bindGalleryIndex() {
    var galleryBox = document.getElementsByClassName('gallery-box');

    for (let index = 0; index < galleryBox.length; index++) {
        const element = galleryBox[index];

        element.setAttribute('data-index', index);

        handleGalleryClick(element);
    }
}

function bindDotIndex() {
    var dotBox = document.getElementsByClassName('dot-box');

    for (let index = 0; index < dotBox.length; index++) {
        const element = dotBox[index];

        element.setAttribute('data-index', index);

        handleDotClick(element);
    }
}

function bindPhotoIndex() {
    var photoBox = document.getElementsByClassName('photo-box');
    var photoFrame = document.getElementsByClassName('photo-frame')[0];

    /* 計算photoFrame總長 */
    photoFrame.style.width = photoBox.length * windowInnerWidth;

    for (let index = 0; index < photoBox.length; index++) {
        const element = photoBox[index];

        element.setAttribute('data-index', index);
        element.style.left = -(index * windowInnerWidth);
        element.style.width = windowInnerWidth;

        /* 滑鼠判斷事件 */
        handleMouseMove(photoBox[index]);
    }
}

function handleGalleryClick(galleryPhoto) {
    /* 點擊的時候取目標的data-index */
    galleryPhoto.addEventListener('click', () => {
        const galleryPhotoIndex = parseInt(galleryPhoto.getAttribute('data-index'), 10);
        const lightBox = document.getElementsByClassName('lightbox-wrap')[0];

        /* 更新globalIndex的index */
        globalIndex = galleryPhotoIndex;

        countTranslate(globalIndex);

        dotStyle(globalIndex);

        /* 開啟燈箱 */
        lightBox.classList.remove('close');
        lightBox.classList.add('open');
    });
}

function handleDotClick(dot) {
    /* 點擊的時候取目標的data-index */
    dot.addEventListener('click', () => {
        switchPhotoEnd = false;

        const dotIndex = parseInt(dot.getAttribute('data-index'), 10);

        /* 更新前的globalIndex，也就是dot被點擊前的globalIndex */
        beforeUpdateIndex = globalIndex;

        /* 更新globalIndex，也就是dot被點擊後的globalIndex */
        globalIndex = dotIndex;

        countTranslate(globalIndex, beforeUpdateIndex, true);

        dotStyle(globalIndex);
    });
}

function bindCloseBtn() {
    /* 燈箱內的關閉按鈕 */
    const closeBtn = document.getElementById('close-btn');

    closeBtn.addEventListener('click', () => {
        closeEvent()
    });
}

function closeEvent() {
    /* 關閉燈箱 */
    const lightBox = document.getElementsByClassName('lightbox-wrap')[0];
    lightBox.classList.remove('open');
    lightBox.classList.add('close');
};

function handleMouseMove(element) {
    let click = false;
    let move = false;
    let xPosition = 0;
    let yPosition = 0;
    let closeStatus = false; /* 關閉燈箱狀態 */
    let horizontalScroll = false; /* 是否為左右滑 */
    let goNext = null; /* 下一張或上一張狀態 */

    element.addEventListener('mousedown', (e) => {
        click = true;

        var e = e || window.event;

        xPosition = e.pageX;
        yPosition = e.pageY;

    }, false);

    element.addEventListener('mousemove', function (e) {
        /* 判斷滑鼠為左鍵按下狀態，且切換動畫狀態已結束(true)，滿足兩條件才執行拖拉判斷 */
        if (click && switchPhotoEnd) {
            move = true;

            var photoBox = document.getElementsByClassName('photo-box');
            var photoBoxLength = photoBox.length;
            var e = e || window.event;

            if (e.pageX > xPosition || e.pageX < xPosition) {
                /* 代表左右滑動觸發 */
                var distance = e.pageX - xPosition;
                horizontalScroll = true;

                photoBox[globalIndex].style.transform = 'translate(' + distance + 'px, 0px)';
                photoBox[globalIndex].style.transition = transformSec;

                if (e.pageX > xPosition) {
                    /* 往右(前一張)，且判斷是否為第一張 */
                    goNext = false;
                    if (globalIndex === 0) {
                        photoBox[photoBoxLength - 1].style.transform = 'translate(' + (distance - windowInnerWidth) + 'px, 0px)';
                        photoBox[photoBoxLength - 1].style.transition = transformSec;
                    } else {
                        photoBox[globalIndex - 1].style.transform = 'translate(' + (distance - windowInnerWidth) + 'px, 0px)';
                        photoBox[globalIndex - 1].style.transition = transformSec;
                    }
                } else {
                    /* 往左(下一張)，且判斷是否為最後一張 */
                    goNext = true;
                    if (globalIndex === photoBoxLength - 1) {
                        photoBox[0].style.transform = 'translate(' + (distance + windowInnerWidth) + 'px, 0px)';
                        photoBox[0].style.transition = transformSec;
                    } else {
                        photoBox[globalIndex + 1].style.transform = 'translate(' + (distance + windowInnerWidth) + 'px, 0px)';
                        photoBox[globalIndex + 1].style.transition = transformSec;
                    }
                }
            } else if ((e.pageY > yPosition) && !horizontalScroll) {
                /* 代表下滑動觸發 */
                element.style.transform = 'translate(0px, ' + (e.pageY - yPosition) + 'px)';
                closeStatus = true;
            }
        }
    }, false);

    element.addEventListener('mouseup', (e) => {
        click = false;

        if (move !== true) {
            if (e.eventPhase === 2 && switchPhotoEnd) {
                closeEvent();
            }
        } else {
            move = false;
            switchPhotoEnd = false;

            var photoBox = document.getElementsByClassName('photo-box');
            var photoBoxLength = photoBox.length;

            /* 左右滑的時候會給一個horizontalScroll的狀態 */
            if (horizontalScroll) {
                horizontalScroll = false;

                /* 不是去下一張就是回上一張 */
                if (goNext) {
                    if (globalIndex === photoBoxLength - 1) {
                        photoBox[globalIndex].style.transform = 'translate(-' + windowInnerWidth + 'px, 0)';
                        photoBox[0].style.transform = 'translate(0, 0)';
                        photoBox[0].style.transition = transformSec;

                        globalIndex = 0;

                        photoBox[0].addEventListener('transitionend', () => {
                            countTranslate(globalIndex);
                        });
                    } else {
                        photoBox[globalIndex].style.transform = 'translate(-' + windowInnerWidth + 'px, 0)';
                        photoBox[globalIndex + 1].style.transform = 'translate(0, 0)';
                        photoBox[globalIndex + 1].style.transition = transformSec;

                        globalIndex = globalIndex + 1;
                    }
                } else {
                    if (globalIndex === 0) {
                        photoBox[globalIndex].style.transform = 'translate(' + windowInnerWidth + 'px, 0)';
                        photoBox[photoBoxLength - 1].style.transform = 'translate(0, 0)';
                        photoBox[photoBoxLength - 1].style.transition = transformSec;

                        globalIndex = photoBoxLength - 1;

                        photoBox[globalIndex].addEventListener('transitionend', () => {
                            countTranslate(globalIndex);
                        });
                    } else {
                        photoBox[globalIndex].style.transform = 'translate(' + windowInnerWidth + 'px, 0)';
                        photoBox[globalIndex - 1].style.transform = 'translate(0, 0)';
                        photoBox[globalIndex - 1].style.transition = transformSec;

                        globalIndex = globalIndex - 1;
                    }
                }
                dotStyle(globalIndex);
                photoBox[globalIndex].style.transition = transformSec;
                photoBox[globalIndex].addEventListener('transitionend', () => switchPhotoEnd = true, false);
            }

            /* 在確認為上下滑且非左右滑的時候，mouseup關閉燈箱 */
            if (closeStatus && !horizontalScroll) {
                closeStatus = false;
                closeEvent();
            }
        }
    }, false);
}

function controlBtn() {
    /* 左右按鈕點擊切換圖片 */
    var prevBtn = document.getElementById('prev-btn');
    var nextBtn = document.getElementById('next-btn');
    var photoBox = document.getElementsByClassName('photo-box');
    var photoBoxLength = photoBox.length;

    nextBtn.addEventListener('click', () => {
        switchPhotoEnd = false;

        if (globalIndex === photoBoxLength - 1) {
            photoBox[globalIndex].style.transform = 'translate(-' + windowInnerWidth + 'px, 0)';
            photoBox[globalIndex].style.transition = transformSec;
            photoBox[0].style.transform = 'translate(0, 0)';
            photoBox[0].style.transition = transformSec;

            globalIndex = 0;

            photoBox[0].addEventListener('transitionend', () => {
                countTranslate(globalIndex);
            });
        } else {
            photoBox[globalIndex].style.transform = 'translate(-' + windowInnerWidth + 'px, 0)';
            photoBox[globalIndex].style.transition = transformSec;
            photoBox[globalIndex + 1].style.transform = 'translate(0, 0)';
            photoBox[globalIndex + 1].style.transition = transformSec;

            globalIndex = globalIndex + 1;
        }

        dotStyle(globalIndex);
        photoBox[globalIndex].addEventListener('transitionend', () => switchPhotoEnd = true, false);
    });

    prevBtn.addEventListener('click', () => {
        switchPhotoEnd = false;

        if (globalIndex === 0) {
            photoBox[photoBoxLength - 1].style.transform = 'translate(0, 0)';
            photoBox[photoBoxLength - 1].style.transition = transformSec;
            photoBox[0].style.transform = 'translate(' + windowInnerWidth + 'px, 0)';
            photoBox[0].style.transition = transformSec;

            globalIndex = photoBoxLength - 1;

            photoBox[0].addEventListener('transitionend', () => {
                countTranslate(globalIndex);
            });
        } else {
            photoBox[globalIndex].style.transform = 'translate(' + windowInnerWidth + 'px, 0)';
            photoBox[globalIndex].style.transition = transformSec;
            photoBox[globalIndex - 1].style.transform = 'translate(0, 0)';
            photoBox[globalIndex - 1].style.transition = transformSec;

            globalIndex = globalIndex - 1;
        }

        dotStyle(globalIndex)
        photoBox[globalIndex].addEventListener('transitionend', () => switchPhotoEnd = true, false);
    });
}

function countTranslate(targetIndex, beforeIndex, transition) {
    /* 計算每一個photo-box的位置 */
    var photoBox = document.getElementsByClassName('photo-box');
    var photoFrame = document.getElementsByClassName('photo-frame')[0];

    photoFrame.style.width = photoBox.length * windowInnerWidth;

    for (let index = 0; index < photoBox.length; index++) {
        const element = photoBox[index];
        const elementIndex = parseInt(element.getAttribute('data-index'), 10);

        element.style.left = -(index * windowInnerWidth);
        element.style.width = windowInnerWidth;

        if (targetIndex > elementIndex) {
            element.style.transform = 'translate(-' + windowInnerWidth + 'px, 0)';
        } else if (targetIndex === elementIndex) {
            element.style.transform = 'translate(0, 0)';
        } else {
            element.style.transform = 'translate(' + windowInnerWidth + 'px, 0)';
        }
        element.style.transition = 'transform 0s';
    }

    if (beforeIndex) {
        photoBox[beforeIndex].style.transition = transformSec;
        photoBox[targetIndex].style.transition = transformSec;
    }

    photoBox[targetIndex].addEventListener('transitionend', () => switchPhotoEnd = true, false);
}

function dotStyle(targetIndex) {
    var dotBox = document.getElementsByClassName('dot-box');

    for (let index = 0; index < dotBox.length; index++) {
        dotBox[index].classList.remove('current');
    }

    dotBox[targetIndex].classList.add('current');
}

window.onload = (function () {

    transformSec = 'transform .5s';
    windowInnerWidth = window.innerWidth;
    switchPhotoEnd = true;
    globalIndex = 0;

    bindGalleryIndex();

    bindDotIndex();

    bindPhotoIndex();

    bindCloseBtn();

    controlBtn();

    window.addEventListener('resize', () => {
        windowInnerWidth = window.innerWidth;
        countTranslate(globalIndex);
    });
})();