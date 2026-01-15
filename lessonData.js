/**
 * ECG 3D - DỮ LIỆU 7 BÀI HỌC
 * Rối loạn dẫn truyền nhĩ-thất và trong thất
 * Chuẩn CK1 Nội Tim mạch
 */

const LessonData = {
    // ============================================
    // A. RỐI LOẠN DẪN TRUYỀN NHĨ – THẤT
    // ============================================
    
    'av-block-1': {
        id: 'av-block-1',
        title: 'Block AV Độ I',
        category: 'av-block',
        icon: 'av1',
        dangerLevel: 'low', // low, medium, high, critical
        
        // Cấu hình 3D
        conduction: {
            blockLocation: 'av', // Vị trí block
            blockType: 'delay', // delay, intermittent, complete
            delayMs: 250, // PR > 200ms
            affectedPaths: ['av']
        },
        
        // 5 bước học
        steps: [
            {
                step: 1,
                title: 'Tim bình thường',
                description: 'Xung điện từ <strong>nút xoang (SA)</strong> truyền qua <strong>nút nhĩ thất (AV)</strong> với thời gian bình thường.',
                action3D: 'normal', // normal, block, slow, alternate
                ecgHighlight: null,
                audioText: 'Đầu tiên, hãy quan sát hệ dẫn truyền bình thường. Xung điện từ nút xoang truyền qua nút nhĩ thất trong khoảng 120 đến 200 mili giây.'
            },
            {
                step: 2,
                title: 'Chậm dẫn truyền tại nút AV',
                description: 'Tại <span class="highlight">nút AV</span>, xung điện bị <strong>chậm lại</strong> nhưng vẫn truyền được xuống thất.',
                action3D: 'delay',
                blockIndicator: 'Chậm tại nút AV',
                ecgHighlight: 'pr-interval',
                audioText: 'Trong block AV độ 1, xung điện bị chậm lại tại nút nhĩ thất. Tuy nhiên, mọi xung điện vẫn truyền được xuống thất, chỉ là chậm hơn bình thường.'
            },
            {
                step: 3,
                title: 'Quan sát xung điện',
                description: 'Mỗi sóng P đều được theo sau bởi QRS, nhưng <span class="highlight">khoảng thời gian dài hơn</span>.',
                action3D: 'delay',
                ecgHighlight: 'pr-interval',
                audioText: 'Quan sát trên ECG: mỗi sóng P đều dẫn đến một phức bộ QRS. Điểm khác biệt là khoảng PR dài hơn bình thường.'
            },
            {
                step: 4,
                title: 'ECG thay đổi',
                description: '<strong>Khoảng PR > 200ms</strong> (> 5 ô nhỏ).<br>Mọi P đều dẫn truyền. QRS bình thường.',
                action3D: 'delay',
                ecgHighlight: 'pr-interval',
                measurements: {
                    pr: { value: '280ms', status: 'warning' },
                    qrs: { value: '80ms', status: 'normal' }
                },
                audioText: 'Trên ECG, khoảng PR kéo dài hơn 200 mili giây, tương đương hơn 5 ô nhỏ. QRS vẫn hẹp và bình thường.'
            },
            {
                step: 5,
                title: 'Kết luận',
                description: 'Block AV độ I là tình trạng <strong>chậm dẫn truyền</strong>, không phải block thực sự. Thường <strong>lành tính</strong>, theo dõi định kỳ.',
                mnemonic: 'PR DÀI > 200ms, MỌI P ĐỀU DẪN',
                clinicalTip: 'Thường gặp ở người già, vận động viên, hoặc do thuốc (beta-blocker, digoxin). Không cần điều trị nếu không triệu chứng.',
                audioText: 'Kết luận: Block AV độ 1 là chậm dẫn truyền, không phải block thực sự. Mẹo nhớ: PR dài hơn 200 mili giây, nhưng mọi sóng P đều dẫn truyền.'
            }
        ],
        
        // ECG mẫu
        ecgSamples: [
            { id: 'av1-sample-1', description: 'PR = 280ms, nhịp đều' },
            { id: 'av1-sample-2', description: 'PR = 320ms, do digoxin' },
            { id: 'av1-sample-3', description: 'PR = 240ms, VĐV marathon' }
        ]
    },
    
    'av-block-2a': {
        id: 'av-block-2a',
        title: 'Block AV Độ II - Mobitz I (Wenckebach)',
        category: 'av-block',
        icon: 'av2a',
        dangerLevel: 'medium',
        
        conduction: {
            blockLocation: 'av',
            blockType: 'wenckebach',
            pattern: [1, 1, 1, 0], // 1 = dẫn, 0 = không dẫn (3:1, 4:1, etc)
            prProgression: [200, 240, 280], // PR dài dần
            affectedPaths: ['av']
        },
        
        steps: [
            {
                step: 1,
                title: 'Tim bình thường',
                description: 'Hệ dẫn truyền hoạt động bình thường với PR ổn định.',
                action3D: 'normal',
                ecgHighlight: null,
                audioText: 'Khởi đầu với hệ dẫn truyền bình thường. Mỗi xung điện từ nút xoang truyền qua nút AV với thời gian không đổi.'
            },
            {
                step: 2,
                title: 'Dẫn truyền chậm dần tại nút AV',
                description: 'Nút AV <span class="highlight">mệt dần</span>, mỗi nhịp dẫn truyền <strong>chậm hơn nhịp trước</strong>.',
                action3D: 'wenckebach',
                blockIndicator: 'AV mệt dần',
                ecgHighlight: 'pr-interval',
                audioText: 'Trong Mobitz I, nút AV như bị mệt dần. Mỗi lần truyền xung điện, nó mất nhiều thời gian hơn lần trước.'
            },
            {
                step: 3,
                title: 'Cuối cùng - mất QRS',
                description: 'Sau vài nhịp PR dài dần, nút AV <strong>"kiệt sức"</strong> → <span class="highlight">một sóng P không dẫn truyền</span> → mất QRS.',
                action3D: 'wenckebach-drop',
                ecgHighlight: 'dropped-beat',
                audioText: 'Đến một lúc, nút AV kiệt sức hoàn toàn và không thể dẫn truyền. Kết quả là một sóng P xuất hiện mà không có QRS theo sau. Đây gọi là nhịp rụng.'
            },
            {
                step: 4,
                title: 'ECG thay đổi',
                description: '<strong>PR dài dần</strong> → sau đó <strong>rụng QRS</strong>.<br>RR ngắn dần trước nhịp rụng.',
                action3D: 'wenckebach',
                ecgHighlight: 'pr-progression',
                measurements: {
                    pr: { value: '200→280ms', status: 'warning' },
                    pattern: '4:3 (4P:3QRS)'
                },
                audioText: 'Trên ECG: PR dài dần qua từng nhịp, sau đó một nhịp bị rụng. Sau nhịp rụng, chu kỳ bắt đầu lại từ đầu với PR ngắn.'
            },
            {
                step: 5,
                title: 'Kết luận',
                description: 'Mobitz I thường <strong>lành tính</strong>, block ở <strong>trên bó His</strong>. Hiếm khi tiến triển thành block hoàn toàn.',
                mnemonic: 'PR DÀI DẦN → RỤNG NHỊP',
                clinicalTip: 'Thường gặp ở nhồi máu thành dưới (RCA cấp máu nút AV). Đáp ứng tốt với Atropine nếu cần.',
                audioText: 'Kết luận: Mobitz I thường lành tính vì block ở trên bó His. Mẹo nhớ: PR dài dần, sau đó rụng nhịp, rồi chu kỳ lặp lại.'
            }
        ],
        
        ecgSamples: [
            { id: 'mob1-sample-1', description: '4:3 Wenckebach' },
            { id: 'mob1-sample-2', description: '3:2 Wenckebach' },
            { id: 'mob1-sample-3', description: 'NMCT thành dưới + Wenckebach' }
        ]
    },
    
    'av-block-2b': {
        id: 'av-block-2b',
        title: 'Block AV Độ II - Mobitz II',
        category: 'av-block',
        icon: 'av2b',
        dangerLevel: 'high',
        
        conduction: {
            blockLocation: 'his', // Block dưới His
            blockType: 'intermittent',
            pattern: [1, 1, 0, 1, 1, 0], // Rụng đột ngột, không báo trước
            prConstant: 160, // PR không đổi
            affectedPaths: ['his', 'bundles']
        },
        
        steps: [
            {
                step: 1,
                title: 'Tim bình thường',
                description: 'Xung điện truyền qua bó His và các nhánh bình thường.',
                action3D: 'normal',
                ecgHighlight: null,
                audioText: 'Quan sát hệ dẫn truyền bình thường. Xung điện từ nút AV đi qua bó His rồi xuống hai nhánh phải và trái.'
            },
            {
                step: 2,
                title: 'Block tại hoặc dưới bó His',
                description: 'Vị trí block ởdescription: 'Vị trí block ở <span class="highlight">dưới bó His</span>. Dẫn truyền thất thường bị mất đột ngột mà không có dấu hiệu báo trước (PR không đổi).',
                action3D: 'block-his',
                blockIndicator: 'Block dưới His',
                ecgHighlight: 'dropped-beat-sudden',
                audioText: 'Block Mobitz II xảy ra ở dưới bó His. Nguy hiểm ở chỗ nó xảy ra đột ngột. Không có PR dài dần, chỉ đơn giản là một nhịp bị mất.'
            },
            {
                step: 3,
                title: 'Quan sát xung điện',
                description: 'Sóng P đi qua nút AV bình thường (PR hằng định).<br>Đột ngột <span class="highlight">bị chặn lại</span> ở bó His hoặc các nhánh.',
                action3D: 'block-his',
                ecgHighlight: 'pr-fixed',
                audioText: 'Hãy nhìn kỹ: Khoảng PR của các nhịp dẫn truyền là cố định, không thay đổi. Nhưng đột nhiên xung điện va vào "bức tường" và không tạo được QRS.'
            },
            {
                step: 4,
                title: 'ECG thay đổi',
                description: '<strong>PR hằng định</strong> ở các nhịp dẫn truyền.<br>Đột ngột mất QRS. QRS thường rộng (nếu block nhánh kết hợp).',
                action3D: 'block-his',
                ecgHighlight: 'pr-fixed',
                measurements: {
                    pr: { value: '160ms (Cố định)', status: 'normal' },
                    pattern: 'Mất QRS đột ngột'
                },
                audioText: 'Trên ECG, dấu hiệu nhận biết là PR không đổi trước khi có nhịp rụng. QRS có thể rộng nếu kèm theo block nhánh.'
            },
            {
                step: 5,
                title: 'Kết luận',
                description: 'Mobitz II là <strong>bệnh lý thực thể</strong>, nguy cơ cao chuyển thành Block độ III (hoàn toàn). Cần đặt máy tạo nhịp.',
                mnemonic: 'PR KHÔNG ĐỔI → RỤNG ĐỘT NGỘT',
                clinicalTip: 'Gợi ý tổn thương rộng hệ dẫn truyền. Chuẩn bị máy tạo nhịp ngay. Atropine thường KHÔNG hiệu quả (do block dưới nút).',
                audioText: 'Kết luận: Mobitz II rất nguy hiểm và thường yêu cầu đặt máy tạo nhịp. Mẹo nhớ: PR không đổi, rồi rụng đột ngột.'
            }
        ],
        ecgSamples: [
            { id: 'mob2-sample-1', description: 'Mobitz II 2:1' },
            { id: 'mob2-sample-2', description: 'Mobitz II trên nền QRS rộng' }
        ]
    },

    'av-block-3': {
        id: 'av-block-3',
        title: 'Block AV Độ III (Hoàn Toàn)',
        category: 'av-block',
        icon: 'av3',
        dangerLevel: 'critical',
        conduction: {
            blockLocation: 'complete', 
            blockType: 'complete',
            pattern: 'dissociation',
            affectedPaths: ['av', 'his']
        },
        steps: [
            {
                step: 1,
                title: 'Tắc nghẽn hoàn toàn',
                description: 'Không có bất kỳ xung điện nào từ nhĩ truyền được xuống thất. Đường dẫn truyền bị <span class="highlight">cắt đứt hoàn toàn</span>.',
                action3D: 'complete-block',
                blockIndicator: 'CẮT ĐỨT HOÀN TOÀN',
                ecgHighlight: 'av-dissociation',
                audioText: 'Trong Block AV độ 3, hay còn gọi là phân ly nhĩ thất hoàn toàn. Cổng nối giữa tầng trên và tầng dưới của tim đã bị đóng chặt.'
            },
            {
                step: 2,
                title: 'Chủ nhịp phụ giải thoát',
                description: 'Tâm thất không nhận được lệnh, tự phát xung từ <strong>bộ nối</strong> hoặc <strong>cơ thất</strong> để duy trì sự sống (nhịp thoát).',
                action3D: 'escape-rhythm',
                ecgHighlight: 'escape-beat',
                audioText: 'Để cứu vãn tình thế, tâm thất tự phát ra nhịp đập riêng của nó, gọi là nhịp thoát. Nhịp này thường rất chậm, chỉ 30 đến 40 lần một phút.'
            },
            {
                step: 3,
                title: 'ECG: Phân ly nhĩ - thất',
                description: 'Sóng P đi theo tần số riêng (60-100 ck/p).<br>QRS đi theo tần số riêng (30-40 ck/p).<br><strong>P và QRS không liên quan nhau.</strong>',
                action3D: 'dissociation',
                ecgHighlight: 'av-dissociation',
                measurements: {
                    pr: { value: 'Biến thiên', status: 'critical' },
                    hr: { value: '35 bpm', status: 'critical' }
                },
                audioText: 'Trên ECG: P đi đường P, QRS đi đường QRS. Chúng đập độc lập và không liên quan gì đến nhau. Sóng P có thể rơi vào bất cứ đâu.'
            },
            {
                step: 4,
                title: 'Xử trí khẩn cấp',
                description: 'Bệnh nhân có thể ngất (Adams-Stokes). Cần thuốc vận mạch/tăng nhịp tim và tạo nhịp cấp cứu.',
                action3D: 'pacing',
                ecgHighlight: 'pacer-spike',
                audioText: 'Đây là tình trạng cấp cứu. Bệnh nhân có thể ngất hoặc tử vong. Cần dùng Atropine, Adrenaline và chuẩn bị tạo nhịp tim ngay lập tức.'
            }
        ],
        ecgSamples: [
            { id: 'av3-sample-1', description: 'QRS hẹp (Thoát bộ nối)' },
            { id: 'av3-sample-2', description: 'QRS rộng (Thoát thất)' }
        ]
    },

    // ============================================
    // B. RỐI LOẠN DẪN TRUYỀN TRONG THẤT
    // ============================================

    'rbbb': {
        id: 'rbbb',
        title: 'Block Nhánh Phải (RBBB)',
        category: 'bundle-block',
        icon: 'rbbb',
        dangerLevel: 'low',
        conduction: {
            blockLocation: 'right-bundle',
            affectedPaths: ['rb']
        },
        steps: [
            {
                step: 1,
                title: 'Cơ chế',
                description: 'Xung điện tắc ở nhánh phải. Thất trái khử cực trước → Xung vòng qua vách liên thất → Khử cực thất phải <strong>muộn</strong>.',
                action3D: 'block-right',
                blockIndicator: 'Tắc nhánh phải',
                audioText: 'Block nhánh phải xảy ra khi đường dây điện sang thất phải bị hỏng. Xung điện phải đi đường vòng từ thất trái sang, làm thất phải co bóp muộn hơn.'
            },
            {
                step: 2,
                title: 'Hình ảnh V1, V2',
                description: 'Dạng <strong>rSR\'</strong> (tai thỏ).<br>Sóng R\' thứ 2 cao rộng do thất phải khử cực muộn hướng về V1.',
                action3D: 'block-right',
                ecgHighlight: 'v1-rsr',
                audioText: 'Tại V1, bạn sẽ thấy hình ảnh tai thỏ điển hình rSR phẩy. Sóng dương thứ hai xuất hiện do dòng điện khử cực thất phải muộn hướng về phía V1.'
            },
            {
                step: 3,
                title: 'Hình ảnh V5, V6',
                description: 'Sóng <strong>S rộng, sâu, có móc</strong> (slurred S wave).',
                action3D: 'block-right',
                ecgHighlight: 'v6-s',
                audioText: 'Ở các chuyển đạo bên trái như V5, V6, bạn sẽ thấy sóng S rộng và sâu, biểu hiện cho việc lực điện chạy ra xa về phía thất phải vào cuối kỳ.'
            }
        ],
        ecgSamples: [{ id: 'rbbb-sample', description: 'RBBB điển hình' }]
    },

    'lbbb': {
        id: 'lbbb',
        title: 'Block Nhánh Trái (LBBB)',
        category: 'bundle-block',
        icon: 'lbbb',
        dangerLevel: 'high',
        conduction: {
            blockLocation: 'left-bundle',
            affectedPaths: ['lb']
        },
        steps: [
            {
                step: 1,
                title: 'Cơ chế',
                description: 'Mất khử cực vách bình thường (trái qua phải). Toàn bộ thất khử cực từ Phải sang Trái.',
                action3D: 'block-left',
                blockIndicator: 'Tắc nhánh trái',
                audioText: 'Block nhánh trái làm thay đổi hoàn toàn hướng khử cực của tim. Bình thường vách khử cực từ trái sang phải, giờ ngược lại từ phải sang trái.'
            },
            {
                step: 2,
                title: 'Hình ảnh V1',
                description: 'Sóng <strong>QS hoặc rS sâu rộng</strong>. Mất sóng r nhỏ đầu tiên (do mất khử cực vách).',
                action3D: 'block-left',
                ecgHighlight: 'v1-qs',
                audioText: 'Tại V1, bạn thấy sóng âm sâu rộng dạng QS hoặc rS. Đó là do toàn bộ lực điện đang chạy xa khỏi V1 để sang thất trái.'
            },
            {
                step: 3,
                title: 'Hình ảnh V6',
                description: 'Sóng <strong>R rộng, có móc</strong> (hình chữ M hoặc tháp bằng đầu). Mất sóng q khử cực vách.',
                action3D: 'block-left',
                ecgHighlight: 'v6-r',
                audioText: 'Tại V6, sóng R to, rộng, có khía hoặc hình tháp cụt đầu. Đây là dấu hiệu quan trọng cần tìm kiếm.'
            },
            {
                step: 4,
                title: 'Lưu ý quan trọng',
                description: '<strong>LBBB mới xuất hiện = Nhồi máu cơ tim cấp</strong> (tương đương ST chênh lên) cho đến khi được chứng minh ngược lại.',
                mnemonic: 'WiLLiaM (LBBB: W ở V1, M ở V6)',
                audioText: 'Hãy nhớ: Nếu bệnh nhân đau ngực mà có Block nhánh trái mới xuất hiện, hãy xử trí như nhồi máu cơ tim cấp.'
            }
        ],
        ecgSamples: [{ id: 'lbbb-sample', description: 'LBBB điển hình' }]
    },
    
    // Placeholder cho LAFB và LPFB để giữ file gọn cho demo
    'lafb': { id: 'lafb', title: 'Block Phân Nhánh Trước Trái', steps: [{step:1, description:'Trục lệch trái (-45 đến -90 độ), qR ở I, aVL.'}] },
    'lpfb': { id: 'lpfb', title: 'Block Phân Nhánh Sau Trái', steps: [{step:1, description:'Trục lệch phải (> 100 độ), rS ở I, aVL. Hiếm gặp đơn độc.'}] },
    
    // Case Lâm Sàng
    'case-syncope': {
        id: 'case-syncope',
        type: 'interactive',
        title: 'Case: Cụ ông ngất xỉu',
        data: {
            history: 'Bệnh nhân nam, 78 tuổi, tiền sử THA. Nhập viện vì ngất khi đang làm vườn. Hiện tại tỉnh táo, tức ngực nhẹ.',
            vitals: 'Mạch: 38 l/p, HA: 90/60 mmHg.',
            initialECG: 'av-block-3', // Link tới logic render của AV3
            questions: [
                {
                    q: 'Bạn cần làm gì đầu tiên?',
                    options: [
                        { text: 'Cho về nhà theo dõi', correct: false, feedback: 'Nguy hiểm! Nhịp 38 l/p có thể gây ngưng tim.' },
                        { text: 'Đo ECG 12 chuyển đạo & mắc monitor', correct: true, feedback: 'Chính xác. Cần xác định nhịp chậm do nguyên nhân gì.' }
                    ]
                },
                {
                    q: 'ECG cho thấy sóng P tần số 80, QRS tần số 38, không liên quan nhau. QRS rộng. Chẩn đoán?',
                    options: [
                        { text: 'Block AV độ 1', correct: false, feedback: 'Sai. Block độ 1 thì mọi P đều dẫn.' },
                        { text: 'Block AV độ 3 (Hoàn toàn)', correct: true, feedback: 'Đúng. Có sự phân ly nhĩ thất hoàn toàn.' }
                    ]
                }
            ]
        }
    }
}; 