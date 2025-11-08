document.addEventListener('DOMContentLoaded', function() {
    const movieCard = document.querySelector('.movie_card');
    const carousel = document.querySelector('#trendingCarousel');
    const prevBtn = document.querySelector('.carousel-control-prev');
    const nextBtn = document.querySelector('.carousel-control-next');

    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;

    // Calculate single card width including gap
    const cardWidth = document.querySelector('.movie-card').offsetWidth + 20; // width + gap

    function scroll(direction) {
        const maxScroll = -(movieCard.scrollWidth - carousel.clientWidth);
        
        if (direction === 'next') {
            currentTranslate = Math.max(maxScroll, currentTranslate - cardWidth);
        } else {
            currentTranslate = Math.min(0, currentTranslate + cardWidth);
        }

        prevTranslate = currentTranslate;
        setTransform();
    }

    function setTransform() {
        movieCard.style.transform = `translateX(${currentTranslate}px)`;
    }

    // Mouse events
    movieCard.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);
    document.addEventListener('mouseleave', dragEnd);

    function dragStart(e) {
        isDragging = true;
        startPos = e.clientX - currentTranslate;
        movieCard.classList.add('dragging');
    }

    function drag(e) {
        if (!isDragging) return;
        e.preventDefault();
        const currentPosition = e.clientX;
        currentTranslate = currentPosition - startPos;
        
        // Add boundaries
        const maxScroll = -(movieCard.scrollWidth - carousel.clientWidth);
        currentTranslate = Math.max(maxScroll, Math.min(0, currentTranslate));
        
        setTransform();
    }

    function dragEnd() {
        if (!isDragging) return;
        isDragging = false;
        movieCard.classList.remove('dragging');
        
        // Snap to nearest card
        const moveBy = currentTranslate - prevTranslate;
        
        if (Math.abs(moveBy) > cardWidth / 3) {
            if (moveBy < 0) {
                currentTranslate = Math.ceil(currentTranslate / cardWidth) * cardWidth;
            } else {
                currentTranslate = Math.floor(currentTranslate / cardWidth) * cardWidth;
            }
        } else {
            currentTranslate = prevTranslate;
        }
        
        // Ensure we don't scroll past boundaries
        const maxScroll = -(movieCard.scrollWidth - carousel.clientWidth);
        currentTranslate = Math.max(maxScroll, Math.min(0, currentTranslate));
        
        setTransform();
        prevTranslate = currentTranslate;
    }

    // Button controls
    prevBtn.addEventListener('click', function() {
        scroll('prev');
    });

    nextBtn.addEventListener('click', function() {
        scroll('next');
    });

    // Prevent drag issues
    movieCard.addEventListener('dragstart', (e) => e.preventDefault());

    // Initial setup to ensure proper card sizing
    window.addEventListener('resize', function() {
        const newCardWidth = document.querySelector('.movie-card').offsetWidth + 20;
        // Adjust current position to maintain alignment
        currentTranslate = Math.ceil(currentTranslate / cardWidth) * newCardWidth;
        prevTranslate = currentTranslate;
        setTransform();
    });
});