let r = 16, h = r * Math.sqrt(3) / 2;
let occupancy = 4 / 5;
let buildings = [];
let bgLines = [];

function setup() {
	createCanvas(h*50, r*30);
	pixelDensity(2);
	strokeWeight(1);
	strokeJoin(ROUND);
	
	initBackgroundLines();
	initBuildings();
}

function draw() {
	background("#fffbe6");

	// Nền nghiêng vàng (các đường chéo động nhẹ)
	stroke("#ffcc4d");
	for (let bgLine of bgLines) {
		let y = bgLine.y + (frameCount * 0.5) % (r / 6);
		line(0, y, width, y - tan(PI / 6) * width);
	}

	// Vẽ và cập nhật toà nhà
	for (let b of buildings) {
		b.show();
		b.move();
	}
}

// -------------------------------
// 🚧 Khởi tạo các đường nền
function initBackgroundLines() {
	for (let y = r / 12 - height * 3 / 2; y < height * 2; y += r / 6) {
		bgLines.push({ y });
	}
}

// -------------------------------
// 🏢 Khởi tạo toàn bộ toà nhà
function initBuildings() {
	let prevCol;
	for (let y = r / 6 - height * 3 / 2; y < height * 2; y += 4 * r) {
		let x = width * 1.5 - h / 2;
		let yOffset = 0;
		while (x > -width / 2) {
			x -= h;
			yOffset -= r / 2;
			let col;
			do {
				col = random(["#E40303", "#FF8C00", "#FFED00", "#008026", "#004DFF", "#750787"]);
			} while (col == prevCol);
			prevCol = col;
			let type = random() < 0.5 ? 'house' : 'apartment';
			let large = random() < 0.5;
			let building = new Building(x, y + yOffset, type, large, col);
			buildings.push(building);
			yOffset += r;
		}
	}
}

// -------------------------------
// 🧱 Class Tòa nhà động
class Building {
	constructor(x, y, type, large, col) {
		this.x = x;
		this.y = y;
		this.type = type;
		this.large = large;
		this.col = col;
		this.speed =0.6;
	}

	move() {
		this.x -= this.speed;
		if (this.x < -2 * h) {
			this.x = width + 2 * h;
		}
	}

	show() {
		fill(this.col);
		if (this.type === 'house') {
			house(this.x, this.y, r, h, this.large);
		} else {
			apartment(this.x, this.y, r, h, this.large);
		}
	}
}

// -------------------------------
// 🏠 Hàm vẽ nhà
function house(x, y, r, h, tall) {
	let heightOffset = tall ? r : 0;

	beginShape();
	vertex(x, y - heightOffset);
	vertex(x, y + r);
	vertex(x + h, y + r / 2);
	vertex(x + h, y - r / 2 - heightOffset);
	vertex(x + h / 2, y - h / 2 - heightOffset);
	endShape(CLOSE);

	fill(5);
	beginShape();
	vertex(x, y - heightOffset);
	vertex(x - h, y - r / 2 - heightOffset);
	vertex(x - h, y + r / 2);
	vertex(x, y + r);
	endShape(CLOSE);

	fill("#fffbe6");
	beginShape();
	vertex(x + h / 2, y - h / 2 - heightOffset);
	vertex(x + h, y - r / 2 - heightOffset);
	vertex(x, y - r - heightOffset);
	vertex(x - h / 2, y - r / 2 - h / 2 - heightOffset);
	endShape(CLOSE);

	beginShape();
	vertex(x + h / 2, y - h / 2 - heightOffset);
	vertex(x - h / 2, y - r / 2 - h / 2 - heightOffset);
	vertex(x - h, y - r / 2 - heightOffset);
	vertex(x, y - heightOffset);
	endShape(CLOSE);

	let n = tall ? 3 : 1;
	push();
	noStroke();
	for (let j = 0; j < n; j++) {
		fill(random() < occupancy ? "#fffbe6" : 5);
		beginShape();
		vertex(x + h / 3, y + r / 3 - r / 6);
		vertex(x + h / 3, y + r * 2 / 3 - r / 6);
		vertex(x + 2 * h / 3, y + r / 2 - r / 6);
		vertex(x + 2 * h / 3, y + r / 6 - r / 6);
		endShape(CLOSE);
		translate(0, -r / 2);
	}
	pop();
}

// -------------------------------
// 🏢 Hàm vẽ apartment
function apartment(x, y, r, h, large) {
	let xWidthOffset = large ? h : 0;
	let yWidthOffset = large ? r / 2 : 0;

	beginShape();
	vertex(x, y - 2 * r);
	vertex(x, y + r);
	vertex(x + h + xWidthOffset, y + r / 2 - yWidthOffset);
	vertex(x + h + xWidthOffset, y - r / 2 - 2 * r - yWidthOffset);
	endShape(CLOSE);

	fill(5);
	beginShape();
	vertex(x, y - 2 * r);
	vertex(x - h, y - r / 2 - 2 * r);
	vertex(x - h, y + r / 2);
	vertex(x, y + r);
	endShape(CLOSE);

	fill("#fffbe6");
	beginShape();
	vertex(x, y - 2 * r);
	vertex(x + h + xWidthOffset, y - r / 2 - 2 * r - yWidthOffset);
	vertex(x + xWidthOffset, y - r - 2 * r - yWidthOffset);
	vertex(x - h, y - r / 2 - 2 * r);
	endShape(CLOSE);

	let m = large ? 3 : 1;
	push();
	noStroke();
	for (let i = 0; i < m; i++) {
		push();
		for (let j = 0; j < 5; j++) {
			fill(random() < occupancy ? "#fffbe6" : 5);
			beginShape();
			vertex(x + h / 3, y + r / 3 - r / 6);
			vertex(x + h / 3, y + r * 2 / 3 - r / 6);
			vertex(x + 2 * h / 3, y + r / 2 - r / 6);
			vertex(x + 2 * h / 3, y + r / 6 - r / 6);
			endShape(CLOSE);
			translate(0, -r / 2);
		}
		pop();
		translate(h / 2, -r / 4);
	}
	pop();
}
