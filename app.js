document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements - General
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const sidebar = document.getElementById('sidebar');
    const navLinks = document.querySelector('.nav-links');
    const subjectTitle = document.getElementById('subject-title');
    const breadcrumbSubject = document.getElementById('breadcrumb-subject');
    const contentDisplay = document.getElementById('content-display');

    // DOM Elements - Summary Modal
    const summaryModal = document.getElementById('summary-modal');
    const closeSummaryBtn = document.getElementById('close-summary');
    const cancelSummaryBtn = document.getElementById('cancel-summary');
    const saveSummaryBtn = document.getElementById('save-summary');
    const modalLessonTitle = document.getElementById('modal-lesson-title');
    const imageUpload = document.getElementById('image-upload');
    const imagePreviewContainer = document.getElementById('image-preview-container');

    // DOM Elements - Add Subject Modal
    const addSubjectBtn = document.getElementById('btn-add-subject');
    const addSubjectModal = document.getElementById('add-subject-modal');
    const closeAddSubjectBtn = document.getElementById('close-add-subject');
    const cancelAddSubjectBtn = document.getElementById('cancel-add-subject');
    const confirmAddSubjectBtn = document.getElementById('confirm-add-subject');
    const newSubjectNameInput = document.getElementById('new-subject-name');
    const iconOptions = document.querySelectorAll('.icon-option');

    // State
    let currentSubject = 'physics';
    const targetClass = '5/1'; // Default class as requested
    let mockData = getMockDatabase();
    let selectedIcon = 'fa-book';

    // ==========================================
    // 1. Sidebar & Navigation Logic
    // ==========================================
    hamburgerBtn.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
    });

    const setupNavigation = () => {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            // Remove old listener to avoid duplicates if re-rendered
            item.replaceWith(item.cloneNode(true));
        });

        // Re-select after cloning
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                
                document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
                
                currentSubject = item.getAttribute('data-subject');
                const subjectName = item.querySelector('.link-text').innerText;
                
                subjectTitle.innerText = subjectName;
                breadcrumbSubject.innerText = subjectName;

                fetchContentFromCloud(currentSubject, targetClass);
                
                if (window.innerWidth <= 768) {
                    sidebar.classList.add('collapsed');
                }
            });
        });
    };

    // ==========================================
    // 2. Fetch & Render Content
    // ==========================================
    const fetchContentFromCloud = (subject, className) => {
        contentDisplay.innerHTML = `
            <div class="loader-container">
                <div class="loader"></div>
                <p>กำลังโหลดเนื้อหาจาก Cloud...</p>
            </div>
        `;

        setTimeout(() => {
            const results = mockData.lessons.filter(
                lesson => lesson.subject === subject && lesson.class === className
            );
            renderContent(results, subject);
        }, 500);
    };

    const renderContent = (lessons, subjectId) => {
        if (lessons.length === 0) {
            contentDisplay.innerHTML = `
                <div class="lesson-card" style="text-align: center; padding: 40px;">
                    <i class="fa-solid fa-folder-open" style="font-size: 3rem; color: #cbd5e1; margin-bottom: 15px;"></i>
                    <h3 style="color: #64748b;">ยังไม่มีเนื้อหาสำหรับวิชานี้</h3>
                </div>
            `;
            return;
        }

        let html = '';
        lessons.forEach((lesson, index) => {
            // Get icon from sidebar
            const activeItem = document.querySelector(`.nav-item[data-subject="${subjectId}"] i`);
            const iconClass = activeItem ? activeItem.className : 'fa-solid fa-book';
            
            const delay = index * 0.1;

            html += `
                <div class="lesson-card" style="animation-delay: ${delay}s">
                    <h3 class="lesson-title">
                        <i class="${iconClass}"></i> 
                        ${lesson.title}
                    </h3>
                    <div class="lesson-meta">
                        <span><i class="fa-regular fa-clock"></i> ${lesson.duration}</span>
                        <span><i class="fa-solid fa-users-viewfinder"></i> ชั้น ${lesson.class}</span>
                        <span><i class="fa-solid fa-cloud"></i> ซิงค์จากคลาวด์แล้ว</span>
                    </div>
                    <p class="lesson-desc">${lesson.description}</p>
                    <button class="btn-start btn-summary" data-title="${lesson.title}">
                        <i class="fa-solid fa-pen-to-square"></i> สรุปสอบ
                    </button>
                </div>
            `;
        });

        contentDisplay.innerHTML = html;

        // Add event listeners for "สรุปสอบ" buttons
        document.querySelectorAll('.btn-summary').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const title = e.currentTarget.getAttribute('data-title');
                openSummaryModal(title);
            });
        });
    };

    // ==========================================
    // 3. Summary Modal Logic
    // ==========================================
    const openSummaryModal = (title) => {
        modalLessonTitle.innerHTML = `<i class="fa-solid fa-book"></i> สรุปเนื้อหา: ${title}`;
        document.getElementById('summary-text').value = '';
        imagePreviewContainer.innerHTML = ''; // clear old images
        summaryModal.classList.add('active');
    };

    const closeSummaryModal = () => {
        summaryModal.classList.remove('active');
    };

    closeSummaryBtn.addEventListener('click', closeSummaryModal);
    cancelSummaryBtn.addEventListener('click', closeSummaryModal);
    
    saveSummaryBtn.addEventListener('click', () => {
        // In a real app, send data to Firebase here
        alert('บันทึกสรุปเรียบร้อยแล้ว! (จำลองการบันทึก)');
        closeSummaryModal();
    });

    // Image Upload Preview (Mock)
    imageUpload.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.className = 'image-preview';
                imagePreviewContainer.appendChild(img);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    });

    // ==========================================
    // 4. Add Subject Modal Logic
    // ==========================================
    const openAddSubjectModal = () => {
        newSubjectNameInput.value = '';
        addSubjectModal.classList.add('active');
    };

    const closeAddSubjectModal = () => {
        addSubjectModal.classList.remove('active');
    };

    addSubjectBtn.addEventListener('click', openAddSubjectModal);
    closeAddSubjectBtn.addEventListener('click', closeAddSubjectModal);
    cancelAddSubjectBtn.addEventListener('click', closeAddSubjectModal);

    // Handle Icon Selection
    iconOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            iconOptions.forEach(opt => opt.classList.remove('active'));
            e.currentTarget.classList.add('active');
            selectedIcon = e.currentTarget.getAttribute('data-icon');
        });
    });

    // Confirm Add Subject
    confirmAddSubjectBtn.addEventListener('click', () => {
        const subjectName = newSubjectNameInput.value.trim();
        if (!subjectName) {
            alert('กรุณากรอกชื่อวิชา');
            return;
        }

        const subjectId = 'subj_' + Date.now(); // Generate unique ID

        // Create new li element
        const li = document.createElement('li');
        li.className = 'nav-item';
        li.setAttribute('data-subject', subjectId);
        li.innerHTML = `
            <a href="#">
                <i class="fa-solid ${selectedIcon}"></i>
                <span class="link-text">${subjectName}</span>
            </a>
        `;

        navLinks.appendChild(li);

        // Re-bind click events for sidebar
        setupNavigation();

        closeAddSubjectModal();
        
        // Optional: Auto switch to new subject
        li.click();
    });

    // ==========================================
    // Initialization
    // ==========================================
    setupNavigation();
    fetchContentFromCloud('physics', targetClass);

    if (window.innerWidth <= 768) {
        sidebar.classList.add('collapsed');
    }
});

// Mock Database Generator
function getMockDatabase() {
    return {
        lessons: [
            // Physics 5/1
            { id: 1, subject: 'physics', class: '5/1', title: 'การเคลื่อนที่แบบฮาร์มอนิกอย่างง่าย', duration: '45 นาที', description: 'ศึกษาการเคลื่อนที่กลับไปกลับมาซ้ำทางเดิมผ่านตำแหน่งสมดุล เช่น การแกว่งของลูกตุ้ม และระบบมวล-สปริง' },
            { id: 2, subject: 'physics', class: '5/1', title: 'คลื่นกล', duration: '50 นาที', description: 'เรียนรู้ธรรมชาติของคลื่นกล องค์ประกอบของคลื่น และสมบัติของคลื่น' },
            { id: 3, subject: 'physics', class: '5/1', title: 'แสงเชิงฟิสิกส์', duration: '60 นาที', description: 'การแทรกสอดและการเลี้ยวเบนของแสงผ่านสลิตคู่และสลิตเดี่ยว' },
            // Chemistry 5/1
            { id: 4, subject: 'chemistry', class: '5/1', title: 'แก๊สและสมบัติของแก๊ส', duration: '55 นาที', description: 'กฎของบอยล์ กฎของชาร์ล กฎของเกย์-ลูสแซก และกฎแก๊สอุดมคติ' },
            { id: 5, subject: 'chemistry', class: '5/1', title: 'อัตราการเกิดปฏิกิริยาเคมี', duration: '40 นาที', description: 'ปัจจัยที่มีผลต่ออัตราการเกิดปฏิกิริยาเคมี ทฤษฎีการชน พลังงานก่อกัมมันต์' },
            // Biology 5/1
            { id: 6, subject: 'biology', class: '5/1', title: 'ระบบย่อยอาหาร', duration: '45 นาที', description: 'การทำงานของระบบย่อยอาหารในมนุษย์และสัตว์ อวัยวะที่เกี่ยวข้องและเอนไซม์ต่างๆ' },
            { id: 7, subject: 'biology', class: '5/1', title: 'ระบบหายใจ', duration: '40 นาที', description: 'โครงสร้างและการทำงานของระบบหายใจ การแลกเปลี่ยนแก๊สที่ปอดและเซลล์' },
            // Math 5/1
            { id: 8, subject: 'math', class: '5/1', title: 'ฟังก์ชันตรีโกณมิติ', duration: '60 นาที', description: 'นิยามของฟังก์ชันตรีโกณมิติ กราฟของฟังก์ชัน และการนำไปประยุกต์ใช้ในการแก้ปัญหาสามเหลี่ยม' },
            { id: 9, subject: 'math', class: '5/1', title: 'เมทริกซ์', duration: '50 นาที', description: 'ชนิดของเมทริกซ์ การบวก ลบ และคูณเมทริกซ์ อินเวอร์สการคูณของเมทริกซ์ขนาด 2x2 และ 3x3' }
        ]
    };
}
