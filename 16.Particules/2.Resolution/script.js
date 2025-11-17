const canvas = document.querySelector('#canvas-1');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

/* Classe Particle */
class Particle {
	constructor(x, y, directionx, directiony, size, color) {
		this.x = x;
		this.y = y;
		this.directionx = directionx;
		this.directiony = directiony;
		this.size = size;
		this.color = color;
	}
	draw() {
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
		ctx.fillStyle = this.color;
		ctx.fill();
	}
	update() {
		if (this.x >= canvas.width || this.x <= 0) {
			this.directionx = -this.directionx;
		} else if (this.y >= canvas.height || this.y <= 0) {
			this.directiony = -this.directiony;
		}
		this.x += this.directionx;
		this.y += this.directiony;
		this.draw();
	}
}
// console.log(new Particle(40, 10, 1, 1, 54, '#000'));

let particlesArray;

/* Remplit le tableau particlesArray avec des particules */
function fillParticlesArray() {
	particlesArray = [];

	const particlesNumber = (canvas.height * canvas.width) / 9000;

	for (let i = 0; i < particlesNumber; i++) {
		// taille entre 1 et 3
		const size = (Math.random() * 2) + 1;
		

		// position X entre 10 et largeur-10
		const x = Math.random() * (canvas.width - 20) + 10;
		// position Y entre 10 et hauteur-10
		const y = Math.random() * (canvas.height - 20) + 10;

		const directionx = randomVelocity();
		const directiony = randomVelocity();

		particlesArray.push(new Particle(x, y, directionx, directiony, size, '#f1f1f1'));
	}
}
fillParticlesArray();

console.log(particlesArray);

function randomVelocity() {
	// Vitesse entre 0.5 et 1.5
	const speed = Math.random() * 1 + 0.5;
	return Math.random() < 0.5 ? speed : -speed;
}

window.addEventListener('resize', handleResize);

/* Gère le redimensionnement de la fenêtre */
function handleResize() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	fillParticlesArray();
}

/* Animation des particules */
function animate() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	for (let i = 0; i < particlesArray.length; i++) {
		particlesArray[i].update();
	}
	connect();
	// JS (event loop + RAF callbacks) -> style/layout -> paint -> composite -> 🖼️ affichage
	requestAnimationFrame(animate);
}
animate();

function connect() {
	const maxDistance = 135;

	for (let i = 0; i < particlesArray.length; i++) {
		const p1 = particlesArray[i];

		for (let j = i + 1; j < particlesArray.length; j++) {
			const p2 = particlesArray[j];
			
			if (Math.abs(p1.x - p2.x) > maxDistance || Math.abs(p1.y - p2.y) > maxDistance) {
				continue
			}

			const deltaX = p1.x - p2.x;
			const deltaY = p1.y - p2.y;
			const hypothenuseSq = deltaX * deltaX + deltaY * deltaY;

			const maxDistanceSq = maxDistance * maxDistance;

			if (hypothenuseSq < maxDistanceSq) {
				const opacity = 1 - (hypothenuseSq / maxDistanceSq);
				ctx.strokeStyle = `rgba(240, 240, 240, ${opacity})`;
				ctx.lineWidth = 0.4;
				ctx.beginPath();
				ctx.moveTo(p1.x, p1.y);
				ctx.lineTo(p2.x, p2.y);
				ctx.stroke();
			}
		}
	}
}