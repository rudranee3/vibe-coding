document.addEventListener('DOMContentLoaded', () => {
    const p1 = document.getElementById('p1');
    const p2 = document.getElementById('p2');
    const legL = document.getElementById('p1-leg-l');
    const legR = document.getElementById('p1-leg-r');
    const restartBtn = document.getElementById('restartBtn');
    const toggleDayBtn = document.getElementById('toggleDayBtn');
    const weatherBtn = document.getElementById('weatherBtn');
    const grassContainer = document.getElementById('grassContainer');
    const weatherLayer = document.getElementById('weatherLayer');
    const birdLayer = document.getElementById('birdLayer');

    let animationFrame;
    let startTime = Date.now();
    let isWalking = true;
    let weatherType = 'clear'; // clear, rain, snow

    // Generate Grass
    for (let i = 0; i < 60; i++) {
        const blade = document.createElement('div');
        blade.className = 'grass';
        blade.style.left = `${Math.random() * 100}%`;
        blade.style.height = `${12 + Math.random() * 18}px`;
        blade.style.animationDelay = `${Math.random() * 2}s`;
        grassContainer.appendChild(blade);
    }

    // Generate Birds
    function spawnBird() {
        const bird = document.createElement('div');
        bird.className = 'bird';
        bird.innerHTML = `<svg viewBox="0 0 20 10"><path d="M0,5 Q5,0 10,5 Q15,10 20,5" fill="none" stroke="currentColor" stroke-width="2"/></svg>`;
        bird.style.top = `${20 + Math.random() * 40}%`;
        bird.style.animationDuration = `${8 + Math.random() * 6}s`;
        birdLayer.appendChild(bird);
        setTimeout(() => bird.remove(), 14000);
    }
    setInterval(spawnBird, 5000);

    // Weather Logic
    function updateWeather() {
        weatherLayer.innerHTML = '';
        if (weatherType === 'clear') return;

        const count = weatherType === 'rain' ? 100 : 50;
        for (let i = 0; i < count; i++) {
            const el = document.createElement('div');
            el.className = weatherType === 'rain' ? 'drop' : 'flake';
            el.style.left = `${Math.random() * 100}%`;
            el.style.animationDuration = `${0.5 + Math.random() * 1}s`;
            if (weatherType === 'snow') el.style.animationDuration = `${3 + Math.random() * 5}s`;
            el.style.animationDelay = `${Math.random() * 2}s`;
            weatherLayer.appendChild(el);
        }
    }

    weatherBtn.addEventListener('click', () => {
        const types = ['clear', 'rain', 'snow'];
        weatherType = types[(types.indexOf(weatherType) + 1) % types.length];
        updateWeather();
    });

    // Reaction Emojis
    function spawnReaction(parent, emoji) {
        const reaction = document.createElement('div');
        reaction.className = 'reaction';
        reaction.textContent = emoji;
        parent.appendChild(reaction);
        setTimeout(() => reaction.remove(), 2000);
    }

    // Leg movement animation logic
    function animateLegs() {
        if (!isWalking) return;

        const time = (Date.now() - startTime) / 1000;
        const speed = 12;
        const amplitude = 12;

        const offsetL = Math.sin(time * speed) * amplitude;
        const offsetR = Math.sin(time * speed + Math.PI) * amplitude;

        legL.setAttribute('x2', 30 + offsetL);
        legR.setAttribute('x2', 30 + offsetR);

        animationFrame = requestAnimationFrame(animateLegs);
    }

    function resetScene() {
        isWalking = true;
        p1.classList.add('walking');
        p1.classList.remove('waving');
        p2.classList.remove('waving');
        
        p1.style.animation = 'none';
        p1.offsetHeight; 
        p1.style.animation = null;
        
        startTime = Date.now();
        cancelAnimationFrame(animationFrame);
        animateLegs();

        setTimeout(() => {
            isWalking = false;
            p1.classList.remove('walking');
            p1.classList.add('waving');
            p2.classList.add('waving');
            spawnReaction(p1, '❤️');
            spawnReaction(p2, '😊');
            cancelAnimationFrame(animationFrame);
            legL.setAttribute('x2', 20);
            legR.setAttribute('x2', 40);
        }, 3200);
    }

    toggleDayBtn.addEventListener('click', () => {
        document.body.classList.toggle('day-mode');
    });

    restartBtn.addEventListener('click', resetScene);

    // Initial Start
    animateLegs();
    setTimeout(() => {
        isWalking = false;
        p1.classList.remove('walking');
        p1.classList.add('waving');
        p2.classList.add('waving');
        spawnReaction(p1, '👋');
    }, 3200);

    // Interactive Star Burst
    document.addEventListener('mousedown', (e) => {
        createBurst(e.clientX, e.clientY);
    });

    function createBurst(x, y) {
        const isDay = document.body.classList.contains('day-mode');
        const color = isDay ? '#FFD700' : '#FFF';

        for (let i = 0; i < 15; i++) {
            const star = document.createElement('div');
            star.className = 'click-star';
            star.style.left = `${x}px`;
            star.style.top = `${y}px`;
            star.style.background = color;
            star.style.boxShadow = `0 0 8px 2px ${color}`;
            
            const angle = (i / 15) * Math.PI * 2;
            const velocity = 4 + Math.random() * 6;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;
            
            document.body.appendChild(star);
            
            let pos = { x, y };
            let opacity = 1;
            
            const animate = () => {
                pos.x += vx;
                pos.y += vy;
                opacity -= 0.025;
                
                star.style.left = `${pos.x}px`;
                star.style.top = `${pos.y}px`;
                star.style.opacity = opacity;
                
                if (opacity > 0) {
                    requestAnimationFrame(animate);
                } else {
                    star.remove();
                }
            };
            
            requestAnimationFrame(animate);
        }
    }
});
