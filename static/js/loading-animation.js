function createLoadingAnimation() {
    const loadingAnimation = document.createElement('div');
    loadingAnimation.classList.add('loading-animation');

    const loader = document.createElement('div');
    loader.classList.add('loader');

    const cube = document.createElement('div');
    cube.classList.add('cube');

    const faces = ['front', 'back', 'right', 'left', 'top', 'bottom'];
    faces.forEach(faceClass => {
        const face = document.createElement('div');
        face.classList.add('face', faceClass);
        cube.appendChild(face);
    });

    loader.appendChild(cube);
    loadingAnimation.appendChild(loader);

    return loadingAnimation;
}
