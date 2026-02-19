// Particle Animation System
class Particle {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.reset();
    }

    reset() {
        this.x = Math.random() * this.canvas.width;
        this.y = Math.random() * this.canvas.height;
        this.size = Math.random() * 30 + 10;
        this.speedX = (Math.random() - 0.5) * 2;
        this.speedY = (Math.random() - 0.5) * 2;
        this.colors = ['#FF69B4', '#FFD700', '#4169E1', '#32CD32', '#FF8C00'];
        this.color = this.colors[Math.floor(Math.random() * this.colors.length)];
        this.opacity = Math.random() * 0.5 + 0.3;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;

        // Wrap around edges
        if (this.x > this.canvas.width) this.x = 0;
        if (this.x < 0) this.x = this.canvas.width;
        if (this.y > this.canvas.height) this.y = 0;
        if (this.y < 0) this.y = this.canvas.height;

        // Pulse effect
        this.opacity = 0.3 + Math.sin(Date.now() * 0.001 + this.x) * 0.2;
    }

    draw() {
        this.ctx.save();
        this.ctx.translate(this.x, this.y);
        this.ctx.rotate(this.rotation);
        this.ctx.globalAlpha = this.opacity;

        // Create gradient
        const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, 'transparent');

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(-this.size, -this.size, this.size * 2, this.size * 2);

        this.ctx.restore();
    }
}

class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particleCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 50;

        this.resize();
        this.init();
        this.animate();

        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push(new Particle(this.canvas));
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        requestAnimationFrame(() => this.animate());
    }
}

// Color Powder Effect on Mouse Move
class ColorPowder {
    constructor() {
        this.canvas = document.getElementById('particleCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.powderParticles = [];

        this.canvas.addEventListener('mousemove', (e) => this.createPowder(e));
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            this.createPowder(e.touches[0]);
        });

        this.animatePowder();
    }

    createPowder(e) {
        const colors = ['#FF69B4', '#FFD700', '#4169E1', '#32CD32', '#FF8C00'];
        
        for (let i = 0; i < 3; i++) {
            this.powderParticles.push({
                x: e.clientX,
                y: e.clientY,
                size: Math.random() * 15 + 5,
                color: colors[Math.floor(Math.random() * colors.length)],
                speedX: (Math.random() - 0.5) * 4,
                speedY: (Math.random() - 0.5) * 4,
                opacity: 0.8,
                life: 100
            });
        }

        // Limit number of particles
        if (this.powderParticles.length > 100) {
            this.powderParticles = this.powderParticles.slice(-100);
        }
    }

    animatePowder() {
        this.powderParticles.forEach((particle, index) => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            particle.speedY += 0.1; // Gravity
            particle.life -= 1;
            particle.opacity = particle.life / 100;

            if (particle.life <= 0) {
                this.powderParticles.splice(index, 1);
            } else {
                this.ctx.save();
                this.ctx.globalAlpha = particle.opacity;
                
                const gradient = this.ctx.createRadialGradient(
                    particle.x, particle.y, 0,
                    particle.x, particle.y, particle.size
                );
                gradient.addColorStop(0, particle.color);
                gradient.addColorStop(1, 'transparent');
                
                this.ctx.fillStyle = gradient;
                this.ctx.fillRect(
                    particle.x - particle.size,
                    particle.y - particle.size,
                    particle.size * 2,
                    particle.size * 2
                );
                
                this.ctx.restore();
            }
        });

        requestAnimationFrame(() => this.animatePowder());
    }
}

// Interactive Card Effects
class InteractiveEffects {
    constructor() {
        this.initCardEffects();
        this.initScrollEffects();
    }

    initCardEffects() {
        const cards = document.querySelectorAll('.emotion-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.createSparkles(card);
            });

            card.addEventListener('click', () => {
                this.pulseEffect(card);
            });
        });
    }

    createSparkles(element) {
        const rect = element.getBoundingClientRect();
        const canvas = document.getElementById('particleCanvas');
        const ctx = canvas.getContext('2d');
        
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                const x = rect.left + Math.random() * rect.width;
                const y = rect.top + Math.random() * rect.height;
                
                this.drawSparkle(ctx, x, y);
            }, i * 50);
        }
    }

    drawSparkle(ctx, x, y) {
        const colors = ['#FF69B4', '#FFD700', '#4169E1', '#32CD32', '#FF8C00'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        ctx.save();
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.8;
        
        for (let i = 0; i < 4; i++) {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate((Math.PI / 2) * i);
            ctx.fillRect(0, -1, 15, 2);
            ctx.restore();
        }
        
        ctx.restore();
        
        // Fade out
        setTimeout(() => {
            ctx.clearRect(x - 20, y - 20, 40, 40);
        }, 500);
    }

    pulseEffect(element) {
        element.style.animation = 'none';
        setTimeout(() => {
            element.style.animation = '';
        }, 10);
    }

    initScrollEffects() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        const elements = document.querySelectorAll('.emotion-card, .content-box, .poem');
        elements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(50px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }
}

// Floating Hearts Effect
class FloatingHearts {
    constructor() {
        this.canvas = document.getElementById('particleCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.hearts = [];
        
        setInterval(() => this.createHeart(), 3000);
        this.animateHearts();
    }

    createHeart() {
        this.hearts.push({
            x: Math.random() * this.canvas.width,
            y: this.canvas.height + 50,
            size: Math.random() * 20 + 15,
            speed: Math.random() * 2 + 1,
            opacity: Math.random() * 0.5 + 0.3,
            wobble: Math.random() * Math.PI * 2
        });
    }

    drawHeart(x, y, size) {
        this.ctx.beginPath();
        this.ctx.moveTo(x, y + size / 4);
        this.ctx.bezierCurveTo(x, y, x - size / 2, y - size / 2, x - size / 2, y + size / 4);
        this.ctx.bezierCurveTo(x - size / 2, y + size / 2, x, y + size, x, y + size);
        this.ctx.bezierCurveTo(x, y + size, x + size / 2, y + size / 2, x + size / 2, y + size / 4);
        this.ctx.bezierCurveTo(x + size / 2, y - size / 2, x, y, x, y + size / 4);
        this.ctx.closePath();
        this.ctx.fill();
    }

    animateHearts() {
        this.hearts.forEach((heart, index) => {
            heart.y -= heart.speed;
            heart.wobble += 0.05;
            heart.x += Math.sin(heart.wobble) * 2;

            if (heart.y < -50) {
                this.hearts.splice(index, 1);
            } else {
                this.ctx.save();
                this.ctx.globalAlpha = heart.opacity;
                this.ctx.fillStyle = '#FF69B4';
                this.drawHeart(heart.x, heart.y, heart.size);
                this.ctx.restore();
            }
        });

        requestAnimationFrame(() => this.animateHearts());
    }
}

// Initialize all effects
document.addEventListener('DOMContentLoaded', () => {
    const particleSystem = new ParticleSystem();
    const colorPowder = new ColorPowder();
    const interactiveEffects = new InteractiveEffects();
    const floatingHearts = new FloatingHearts();

    // Add cursor trail effect
    let trail = [];
    document.addEventListener('mousemove', (e) => {
        trail.push({ x: e.clientX, y: e.clientY, time: Date.now() });
        
        // Keep only recent positions
        trail = trail.filter(point => Date.now() - point.time < 1000);
    });

    console.log('🎨 Holi Festival Page Loaded - Let the colors dance! 🎉');
});
