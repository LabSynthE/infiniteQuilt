(function () {
    'use strict';

    // Images are named images/assembly_0001_full.jpg ... assembly_0250_full.jpg
    // (thumbnail for the quilt) with a matching _full.jpg shown on click.
    const TOTAL = 250;
    const BATCH = 6;

    const quilt = document.querySelector('.quilt');
    const loader = document.querySelector('.loader');
    const lightbox = document.querySelector('.lightbox');
    const lightboxImg = lightbox.querySelector('img');

    let next = 1;

    const pad = (n) => String(n).padStart(4, '0');

    function addBatch() {
        const end = Math.min(next + BATCH - 1, TOTAL);
        for (; next <= end; next++) {
            const id = pad(next);
            const a = document.createElement('a');
            a.className = 'tile';
            a.href = `images/assembly_${id}_full.jpg`;

            const img = document.createElement('img');
            img.loading = 'lazy'; // browser-level lazy load as well
            img.decoding = 'async';
            img.src = `images/assembly_${id}_full.jpg`;
            img.alt = `Quilt square ${next}`;

            a.appendChild(img);

            // tape across the seam above every image except the first
            if (next > 1) {
                ['l', 'r'].forEach((side) => {
                    const t = document.createElement('img');
                    t.className = `tape tape-${side}`;
                    t.src = `images/stitch.png`;
                    t.alt = 'thread in x shape';
                    t.setAttribute('aria-hidden', 'true');
                    a.appendChild(t);
                });
            }
            quilt.appendChild(a);
        }

        if (next > TOTAL) {
            observer.disconnect();
            loader.classList.remove('show');
        } else {
            // re-arm the observer in case the sentinel is still on screen
            observer.unobserve(loader);
            observer.observe(loader);
        }
    }

    // load the next batch whenever the loader nears the viewport
    const observer = new IntersectionObserver(
        (entries) => {
            if (entries[0].isIntersecting) {
                setTimeout(addBatch, 200);
            }
        },
        { rootMargin: '600px' }
    );

    // lightbox: click a tile to see the full-size image
    quilt.addEventListener('click', (e) => {
        const tile = e.target.closest('.tile');
        if (!tile) return;
        e.preventDefault();
        lightboxImg.src = tile.href;
        lightboxImg.alt = tile.querySelector('img').alt;
        lightbox.hidden = false;
    });

    function closeLightbox() {
        lightbox.hidden = true;
        lightboxImg.removeAttribute('src');
    }
    lightbox.addEventListener('click', closeLightbox);
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
    });

    // initialize
    observer.observe(loader);
})();
