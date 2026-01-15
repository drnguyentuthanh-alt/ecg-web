class ECGRenderer {
    constructor() {
        this.leads = document.querySelectorAll('.ecg-lead canvas');
        this.contexts = {};
        this.dataBuffers = {};
        this.x = 0;
        this.speed = 1; // Pixels per frame
        
        this.init();
    }

    init() {
        this.leads.forEach(canvas => {
            const parent = canvas.parentElement;
            canvas.width = parent.offsetWidth;
            canvas.height = parent.offsetHeight;
            
            const leadName = parent.dataset.lead;
            this.contexts[leadName] = canvas.getContext('2d');
            this.dataBuffers[leadName] = [];
            
            // Vẽ lưới ban đầu
            this.drawGrid(this.contexts[leadName], canvas.width, canvas.height);
        });
        
        // Rhythm strip
        const rhythmCanvas = document.getElementById('rhythm-strip');
        if (rhythmCanvas) {
            rhythmCanvas.width = rhythmCanvas.parentElement.offsetWidth;
            rhythmCanvas.height = rhythmCanvas.parentElement.offsetHeight;
            this.contexts['RHYTHM'] = rhythmCanvas.getContext('2d');
            this.drawGrid(this.contexts['RHYTHM'], rhythmCanvas.width, rhythmCanvas.height);
        }

        this.animate();
    }

    drawGrid(ctx, w, h) {
        ctx.fillStyle = '#001a0d'; // Màu nền tối
        ctx.fillRect(0, 0, w, h);
        
        ctx.strokeStyle = '#1a3a2a'; // Màu lưới
        ctx.lineWidth = 1;
        
        // Ô nhỏ 5px (giả lập)
        ctx.beginPath();
        for (let x = 0; x < w; x += 10) { ctx.moveTo(x, 0); ctx.lineTo(x, h); }
        for (let y = 0; y < h; y += 10) { ctx.moveTo(0, y); ctx.lineTo(w, y); }
        ctx.stroke();
        
        // Ô lớn 25px
        ctx.strokeStyle = '#2a5a3a';
        ctx.beginPath();
        for (let x = 0; x < w; x += 50) { ctx.moveTo(x, 0); ctx.lineTo(x, h); }
        for (let y = 0; y < h; y += 50) { ctx.moveTo(0, y); ctx.lineTo(w, y); }
        ctx.stroke();
    }

    // Hàm tạo sóng P-QRS-T giả lập
    generateBeat(type = 'normal') {
        // Trả về mảng điểm y cho một nhịp
        // Đây là nơi logic sinh sóng ECG hoạt động
        // Để đơn giản cho demo, ta dùng mảng hardcode ngắn
        let points = [];
        const baseline = 0;
        
        // Sóng P
        for(let i=0; i<10; i++) points.push(-5 * Math.sin(Math.PI * i / 10)); 
        // Đoạn PR
        for(let i=0; i<5; i++) points.push(0);
        
        if (type === 'dropped') {
            // Không có QRS
            for(let i=0; i<30; i++) points.push(0);
        } else {
            // QRS
            points.push(-20); // Q
            points.push(40);  // R
            points.push(-10); // S
            // ST-T
            for(let i=0; i<10; i++) points.push(0);
            for(let i=0; i<15; i++) points.push(-8 * Math.sin(Math.PI * i / 15)); // T
        }
        
        return points;
    }

    updateData(lessonId) {
        // Logic đẩy dữ liệu mới vào buffer dựa trên bài học hiện tại
        // Ví dụ: nếu av-block-3, đẩy P và QRS độc lập
    }

    animate() {
        // Render loop: Xóa canvas -> Vẽ lưới -> Vẽ đường line từ buffer
        // (Chi tiết cài đặt cuộn giấy ghi ECG được lược bỏ để gọn code)
        requestAnimationFrame(() => this.animate());
    }
}