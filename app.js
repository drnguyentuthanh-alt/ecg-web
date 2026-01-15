document.addEventListener('DOMContentLoaded', () => {
    // 1. Khởi tạo các Modules
    const heart3d = new Heart3D('heart-canvas');
    const ecgRenderer = new ECGRenderer();
    
    // 2. UI References
    const sidebar = document.getElementById('sidebar');
    const btnMenu = document.getElementById('btn-menu');
    const loadingScreen = document.getElementById('loading-screen');
    const app = document.getElementById('app');
    
    // 3. Xử lý Loading
    setTimeout(() => {
        loadingScreen.classList.add('fade-out');
        app.classList.remove('hidden');
        heart3d.start();
        heart3d.resize(); // Đảm bảo size đúng sau khi hiện
    }, 1500);

    // 4. Xử lý Menu/Sidebar
    btnMenu.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
    });

    document.getElementById('btn-close-sidebar').addEventListener('click', () => {
        sidebar.classList.add('collapsed');
    });

    // 5. Logic chọn bài học
    const lessonButtons = document.querySelectorAll('.lesson-btn');
    let currentLessonId = null;
    let currentStep = 1;

    lessonButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Remove active class
            lessonButtons.forEach(b => b.classList.remove('active'));
            // Add active
            const target = e.currentTarget; // Dùng currentTarget để lấy đúng button (kể cả click vào icon con)
            target.classList.add('active');
            
            const lessonId = target.dataset.lesson;
            loadLesson(lessonId);
            
            // Mobile: đóng sidebar khi chọn
            if (window.innerWidth < 1024) {
                sidebar.classList.add('collapsed');
            }
        });
    });

    function loadLesson(id) {
        currentLessonId = id;
        currentStep = 1;
        const data = LessonData[id];
        
        if (!data) return;

        // Cập nhật UI tiêu đề
        document.getElementById('current-lesson-title').innerText = data.title;
        // Reset controls
        updateStepUI(data);
        
        // Cấu hình Heart3D & ECG
        heart3d.setLesson(id);
        
        // Nếu là Case lâm sàng
        if (data.type === 'interactive') {
            openCaseModal(data);
        }
    }

    function updateStepUI(lessonData) {
        // Cập nhật nội dung giải thích theo step hiện tại
        const stepData = lessonData.steps.find(s => s.step === currentStep);
        if (!stepData) return;

        const explanationText = document.getElementById('explanation-text');
        explanationText.innerHTML = `
            <h4>Bước ${stepData.step}: ${stepData.title}</h4>
            <p>${stepData.description}</p>
        `;

        // Update Dots
        const dots = document.querySelectorAll('.step-dots .dot');
        dots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx + 1 === currentStep);
        });

        // Update Buttons
        document.getElementById('btn-prev-step').disabled = currentStep === 1;
        document.getElementById('btn-next-step').disabled = currentStep === lessonData.steps.length;

        // Update Mnemonic nếu có
        const mnemonicBox = document.getElementById('mnemonic-box');
        const mnemonicText = document.getElementById('mnemonic-text');
        if (stepData.mnemonic || (currentStep === lessonData.steps.length && lessonData.mnemonic)) {
            mnemonicBox.classList.remove('hidden');
            mnemonicText.innerText = stepData.mnemonic || lessonData.mnemonic;
        } else {
            mnemonicBox.classList.add('hidden');
        }
    }

    // 6. Navigation Buttons
    document.getElementById('btn-next-step').addEventListener('click', () => {
        const data = LessonData[currentLessonId];
        if (currentStep < data.steps.length) {
            currentStep++;
            updateStepUI(data);
            // Trigger animation change here if needed
        }
    });

    document.getElementById('btn-prev-step').addEventListener('click', () => {
        const data = LessonData[currentLessonId];
        if (currentStep > 1) {
            currentStep--;
            updateStepUI(data);
        }
    });

    // 7. Modal Logic (Emergency & Case)
    const emergencyBtn = document.getElementById('btn-emergency');
    const emergencyModal = document.getElementById('emergency-mode');
    const closeEmergencyBtn = document.getElementById('btn-close-emergency');

    emergencyBtn.addEventListener('click', () => {
        emergencyModal.classList.remove('hidden');
    });

    closeEmergencyBtn.addEventListener('click', () => {
        emergencyModal.classList.add('hidden');
    });
    
    // Case Modal logic
    const caseModal = document.getElementById('case-modal');
    function openCaseModal(data) {
        caseModal.classList.remove('hidden');
        const content = document.getElementById('case-content');
        content.innerHTML = `
            <div class="case-scenario">
                <p><strong>Bệnh sử:</strong> ${data.data.history}</p>
                <p><strong>Sinh hiệu:</strong> ${data.data.vitals}</p>
            </div>
            <div class="case-ecg-placeholder" style="height:150px; background:#000; margin: 10px 0;">
                <p style="color:#0f0; text-align:center; padding-top:60px;">ĐANG HIỂN THỊ ECG MONITORING...</p>
            </div>
            <div class="case-questions">
                ${data.data.questions.map((q, idx) => `
                    <div class="question-block">
                        <p><strong>Câu hỏi ${idx+1}:</strong> ${q.q}</p>
                        <div class="options">
                            ${q.options.map(opt => `
                                <button class="option-btn" onclick="checkAnswer(this, ${opt.correct}, '${opt.feedback}')">
                                    ${opt.text}
                                </button>
                            `).join('')}
                        </div>
                        <div class="feedback hidden"></div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    document.getElementById('btn-close-case').addEventListener('click', () => {
        caseModal.classList.add('hidden');
    });

    // Global function for case interaction
    window.checkAnswer = function(btn, isCorrect, feedback) {
        const feedbackDiv = btn.parentElement.nextElementSibling;
        feedbackDiv.classList.remove('hidden');
        feedbackDiv.innerText = feedback;
        feedbackDiv.style.color = isCorrect ? '#00ff88' : '#ff4444';
        feedbackDiv.style.fontWeight = 'bold';
        feedbackDiv.style.marginTop = '8px';
        
        // Disable siblings
        const siblings = btn.parentElement.children;
        for(let sib of siblings) {
            sib.disabled = true;
            if(sib === btn) {
                sib.style.background = isCorrect ? 'rgba(0,255,136,0.2)' : 'rgba(255,68,68,0.2)';
                sib.style.borderColor = isCorrect ? '#00ff88' : '#ff4444';
            }
        }
    };
});