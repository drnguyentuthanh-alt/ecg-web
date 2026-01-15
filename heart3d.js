class Heart3D {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.offsetWidth;
        this.height = this.canvas.offsetHeight;
        
        // Resize handler
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        window.addEventListener('resize', () => this.resize());

        // Cấu hình vị trí các nút (Toạ độ tương đối 0-1)
        this.nodes = {
            sa: { x: 0.35, y: 0.25, color: 'var(--sa-node)' },
            av: { x: 0.5, y: 0.45, color: 'var(--av-node)' },
            his: { x: 0.52, y: 0.52, color: 'var(--his-bundle)' },
            rb: { x: 0.45, y: 0.75, color: 'var(--right-bundle)' }, // Nhánh phải
            lb: { x: 0.6, y: 0.6, color: 'var(--left-bundle)' },   // Gốc nhánh trái
            laf: { x: 0.65, y: 0.55, color: 'var(--laf-bundle)' }, // Phân nhánh trước
            lpf: { x: 0.62, y: 0.75, color: 'var(--lpf-bundle)' }  // Phân nhánh sau
        };

        this.pulses = []; // Mảng chứa các xung điện đang chạy
        this.state = 'normal'; // normal, av1, av2, av3, rbbb, etc.
        this.animationId = null;
        this.lastTime = 0;
        
        // Cấu hình tốc độ và block
        this.params = {
            avDelay: 1000, // ms
            saRate: 1000, // ms
            blockAv: false,
            blockRb: false,
            blockLb: false
        };

        this.images = {}; // Chứa ảnh nền tim (nếu cần)
    }

    resize() {
        this.width = this.canvas.parentElement.offsetWidth;
        this.height = this.canvas.parentElement.offsetHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.drawStaticHeart();
    }

    // Vẽ hình tim tĩnh (Outline)
    drawStaticHeart() {
        const ctx = this.ctx;
        const w = this.width;
        const h = this.height;

        ctx.clearRect(0, 0, w, h);

        // Vẽ bóng tim mờ (Stylized)
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 3;
        // Giả lập hình tim đơn giản
        ctx.moveTo(w * 0.5, h * 0.25);
        ctx.bezierCurveTo(w * 0.9, h * 0.1, w * 0.9, h * 0.6, w * 0.5, h * 0.9);
        ctx.bezierCurveTo(w * 0.1, h * 0.6, w * 0.1, h * 0.1, w * 0.5, h * 0.25);
        ctx.stroke();
        ctx.fillStyle = 'rgba(255, 100, 100, 0.05)';
        ctx.fill();

        // Vẽ các đường dây dẫn truyền (Tĩnh)
        this.drawPath('sa', 'av', 'rgba(255,255,255,0.2)');
        this.drawPath('av', 'his', 'rgba(255,255,255,0.2)');
        this.drawPath('his', 'rb', 'rgba(255,255,255,0.2)');
        this.drawPath('his', 'lb', 'rgba(255,255,255,0.2)');
        this.drawPath('lb', 'laf', 'rgba(255,255,255,0.2)');
        this.drawPath('lb', 'lpf', 'rgba(255,255,255,0.2)');

        // Vẽ các nút
        for (let key in this.nodes) {
            this.drawNode(this.nodes[key]);
        }
    }

    drawNode(node) {
        const x = node.x * this.width;
        const y = node.y * this.height;
        
        this.ctx.beginPath();
        this.ctx.arc(x, y, 6, 0, Math.PI * 2);
        // Lấy màu từ CSS variable (giả lập) hoặc hardcode
        // Ở đây ta dùng check computed style trong thực tế, nhưng demo dùng hardcode map
        this.ctx.fillStyle = node.color.replace('var(--', '').replace(')', '') === 'sa-node' ? '#ff6b6b' : '#ffd93d'; 
        this.ctx.fill();
    }

    drawPath(fromKey, toKey, color) {
        const from = this.nodes[fromKey];
        const to = this.nodes[toKey];
        
        this.ctx.beginPath();
        this.ctx.moveTo(from.x * this.width, from.y * this.height);
        this.ctx.lineTo(to.x * this.width, to.y * this.height);
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    }

    // Tạo một xung điện mới
    spawnPulse(type = 'sinus') {
        if (type === 'sinus') {
            this.pulses.push({
                current: 'sa',
                next: 'av',
                progress: 0,
                speed: 0.02, // Tốc độ di chuyển
                color: '#ffff00',
                id: Date.now()
            });
        }
    }

    update(dt) {
        // Logic di chuyển xung điện
        // Đây là phần phức tạp nhất để mô phỏng block
        // Trong phiên bản demo này, ta sẽ làm đơn giản hoá chuyển động
        
        this.pulses.forEach((p, index) => {
            p.progress += p.speed;
            
            if (p.progress >= 1) {
                // Đã đến đích
                this.handlePulseArrival(p, index);
            }
        });
        
        // Xóa xung đã kết thúc
        this.pulses = this.pulses.filter(p => !p.finished);
    }

    handlePulseArrival(pulse, index) {
        // Logic điều hướng xung điện
        if (pulse.next === 'av') {
            // Đến AV
            if (this.params.blockAv === 'complete') {
                pulse.finished = true; // Block độ 3
            } else if (this.params.blockAv === 'delay') {
                 // Giữ lại ở AV một chút rồi đi tiếp (Block độ 1)
                 pulse.current = 'av';
                 pulse.next = 'his';
                 pulse.progress = -0.5; // Delay âm để chờ
            } else {
                pulse.current = 'av';
                pulse.next = 'his';
                pulse.progress = 0;
            }
        } else if (pulse.next === 'his') {
            // Đến His, tách ra 2 nhánh
            pulse.finished = true; // Xung gốc kết thúc, đẻ ra 2 xung con
            
            // Nhánh phải
            if (!this.params.blockRb) {
                this.pulses.push({ ...pulse, current: 'his', next: 'rb', progress: 0, finished: false, id: Date.now()+1 });
            }
            // Nhánh trái
            if (!this.params.blockLb) {
                this.pulses.push({ ...pulse, current: 'his', next: 'lb', progress: 0, finished: false, id: Date.now()+2 });
            }
        } else if (pulse.next === 'lb') {
            // Tách phân nhánh trái
            pulse.finished = true;
            this.pulses.push({ ...pulse, current: 'lb', next: 'laf', progress: 0, finished: false, id: Date.now()+3 });
            this.pulses.push({ ...pulse, current: 'lb', next: 'lpf', progress: 0, finished: false, id: Date.now()+4 });
        } else {
            // Đến tận cùng Purkinje
            pulse.finished = true;
            this.triggerVentricularContraction(); // Hiệu ứng co bóp tim
        }
    }

    triggerVentricularContraction() {
        // Hiệu ứng tim co bóp (scale canvas hoặc overlay)
        const app = document.getElementById('heart-pulse'); 
        // Trong thực tế sẽ kích hoạt animation CSS
    }

    render() {
        this.drawStaticHeart();
        
        // Vẽ xung điện
        this.pulses.forEach(p => {
            if (p.progress < 0) return; // Đang delay

            const from = this.nodes[p.current];
            const to = this.nodes[p.next];
            
            const x = from.x * this.width + (to.x * this.width - from.x * this.width) * p.progress;
            const y = from.y * this.height + (to.y * this.height - from.y * this.height) * p.progress;

            this.ctx.beginPath();
            this.ctx.arc(x, y, 8, 0, Math.PI * 2);
            this.ctx.fillStyle = '#00ffff';
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = '#00ffff';
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
        });
    }

    animate() {
        const now = Date.now();
        const dt = now - this.lastTime;
        this.lastTime = now;

        // Tạo nhịp xoang định kỳ (đơn giản hoá)
        if (now % this.params.saRate < 20 && Math.random() > 0.5) { 
            // Cần logic timer chính xác hơn cho bản production
        }

        this.update(dt);
        this.render();
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    start() {
        this.lastTime = Date.now();
        this.animate();
        // Giả lập nhịp tim
        this.beatInterval = setInterval(() => this.spawnPulse('sinus'), 1000);
    }

    stop() {
        cancelAnimationFrame(this.animationId);
        clearInterval(this.beatInterval);
    }

    setLesson(lessonId) {
        // Cấu hình tham số dựa trên bài học
        this.pulses = [];
        if (lessonId === 'av-block-3') {
            this.params.blockAv = 'complete';
            // Tự động kích hoạt nhịp thoát thất
            clearInterval(this.beatInterval);
            this.beatInterval = setInterval(() => this.spawnPulse('sinus'), 600); // Nhĩ nhanh
            this.escapeInterval = setInterval(() => {
                // Nhịp thoát từ thất (ko qua hệ dẫn truyền trên)
                this.triggerVentricularContraction();
            }, 1500); // Thất chậm
        } else {
            this.params.blockAv = false;
            clearInterval(this.escapeInterval);
            // ... cấu hình các block khác
        }
    }
}